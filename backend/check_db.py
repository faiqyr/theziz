import asyncio
from app.db.postgres import AsyncSessionLocal
from sqlalchemy.future import select
from app.models.journal import Journal

async def test():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Journal.publication_fee, Journal.is_free, Journal.notes, Journal.title, Journal.sinta_level))
        print("DATABASE RECORDS:")
        for r in result.all():
            print(r)

asyncio.run(test())
