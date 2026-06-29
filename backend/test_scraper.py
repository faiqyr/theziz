import asyncio
from app.db.postgres import AsyncSessionLocal
from app.services.scraper_service import ScraperService

async def test():
    async with AsyncSessionLocal() as db:
        print('Scraping SINTA 3...')
        print(await ScraperService.scrape_sinta(db, 3))
        
        print('Extracting fees with AI...')
        print(await ScraperService.extract_fee_with_ai(db))

asyncio.run(test())
