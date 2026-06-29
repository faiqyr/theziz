import httpx
from bs4 import BeautifulSoup
import os
import json
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.journal import Journal

class ScraperService:
    @staticmethod
    async def scrape_sinta(db: AsyncSession, sinta_level: int = 4):
        """Scrapes the SINTA website for journals."""
        url = f"https://sinta.kemdiktisaintek.go.id/journals?sinta={sinta_level}"
        
        try:
            async with httpx.AsyncClient(verify=False) as client:
                response = await client.get(url, timeout=30.0)
                response.raise_for_status()
                
            soup = BeautifulSoup(response.text, 'html.parser')
            items = soup.find_all('div', class_='list-item')
            
            scraped_count = 0
            for item in items:
                title_elem = item.find('div', class_='affil-name')
                if not title_elem:
                    continue
                
                title = title_elem.text.strip()
                
                inst_elem = item.find('div', class_='affil-loc')
                institution = inst_elem.text.strip() if inst_elem else "Unknown"
                
                links = item.find_all('a')
                ojs_url = ""
                for link in links:
                    if 'Website' in link.text:
                        ojs_url = link.get('href')
                        break
                
                if not ojs_url:
                    for link in links:
                        href = link.get('href', '')
                        if href.startswith('http') and not any(d in href for d in ['sinta', 'scholar.google', 'garuda']):
                            ojs_url = href
                            break
                
                if title and ojs_url:
                    # Check if exists
                    stmt = select(Journal).where(Journal.ojs_url == ojs_url)
                    result = await db.execute(stmt)
                    existing = result.scalars().first()
                    
                    if not existing:
                        journal = Journal(
                            title=title,
                            sinta_level=sinta_level,
                            institution=institution,
                            ojs_url=ojs_url
                        )
                        db.add(journal)
                        scraped_count += 1
                        
            await db.commit()
            return {"status": "success", "scraped_count": scraped_count}
            
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def extract_fee_with_ai(db: AsyncSession):
        """Extracts publication fee from un-processed journals using AI."""
        # Find journals that haven't been fully processed
        stmt = select(Journal).where(Journal.is_free == False, Journal.publication_fee == 0.0).limit(5)
        result = await db.execute(stmt)
        journals = result.scalars().all()
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            return {"status": "error", "message": "GROQ_API_KEY not found"}

        processed = 0
        async with httpx.AsyncClient(verify=False) as client:
            for journal in journals:
                try:
                    # Fetch OJS content (Timeout added as some OJS are slow)
                    res = await client.get(journal.ojs_url, timeout=15.0)
                    soup = BeautifulSoup(res.text, 'html.parser')
                    # Strip to limit tokens
                    text_content = soup.get_text(separator=' ', strip=True)[:4000] 
                    
                    prompt = f"""
                    Baca teks website jurnal ini dan ekstrak informasi biaya publikasi (Article Processing Charge / APC).
                    Berikan response secara STRICT dalam format JSON murni tanpa markdown block.
                    {{
                        "is_free": boolean (true jika gratis, false jika berbayar),
                        "publication_fee": number (nominal angka saja),
                        "currency": "IDR" atau "USD",
                        "notes": "string (catatan singkat tentang biaya atau syarat gratisnya)"
                    }}
                    
                    Teks Web:
                    {text_content}
                    """
                    
                    headers = {
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    }
                    data = {
                        "model": "llama-3.1-8b-instant",
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.1
                    }
                    
                    ai_res = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data, timeout=30.0)
                    ai_res.raise_for_status()
                    
                    ai_data = ai_res.json()
                    json_text = ai_data["choices"][0]["message"]["content"]
                    parsed = json.loads(json_text)
                    
                    journal.is_free = parsed.get("is_free", False)
                    journal.publication_fee = parsed.get("publication_fee", 0.0)
                    journal.currency = parsed.get("currency", "IDR")
                    journal.notes = parsed.get("notes", "")
                    
                    processed += 1
                    
                except Exception as e:
                    print(f"Error processing {journal.ojs_url}: {e}")
                    journal.notes = f"Failed to extract: {str(e)}"
                    
            await db.commit()
            
        return {"status": "success", "processed_count": processed}
