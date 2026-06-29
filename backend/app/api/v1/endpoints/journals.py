from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.db.postgres import get_db
from app.models.journal import Journal

router = APIRouter()

@router.get("/")
async def get_journals(
    sinta_level: Optional[int] = Query(None, description="Filter by SINTA level"),
    max_fee: Optional[float] = Query(None, description="Maximum publication fee (0 for free)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get journals with optional filters.
    """
    stmt = select(Journal)
    
    if sinta_level is not None:
        stmt = stmt.where(Journal.sinta_level == sinta_level)
        
    if max_fee is not None:
        if max_fee == 0:
            stmt = stmt.where(Journal.is_free == True)
        else:
            stmt = stmt.where(Journal.publication_fee <= max_fee)
            
    # Optional: order by updated or fee
    stmt = stmt.order_by(Journal.publication_fee.asc())
    
    result = await db.execute(stmt)
    journals = result.scalars().all()
    
    return [
        {
            "id": str(j.id),
            "title": j.title,
            "sinta_level": j.sinta_level,
            "institution": j.institution,
            "ojs_url": j.ojs_url,
            "is_free": j.is_free,
            "publication_fee": j.publication_fee,
            "currency": j.currency,
            "notes": j.notes,
            "last_updated": j.last_updated.isoformat() if j.last_updated else None
        }
        for j in journals
    ]
