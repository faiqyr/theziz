from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.services.scraper_service import ScraperService

router = APIRouter()

@router.post("/run")
async def run_scraper_and_ai(sinta_level: int = 4, db: AsyncSession = Depends(get_db)):
    """Trigger the scraper and AI fee extractor manually."""
    try:
        # Run Scraper
        scrape_result = await ScraperService.scrape_sinta(db, sinta_level)
        
        # Run AI Extractor
        ai_result = await ScraperService.extract_fee_with_ai(db)
        
        return {
            "scraper": scrape_result,
            "ai_extractor": ai_result
        }
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}
