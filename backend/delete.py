import asyncio
from app.db.postgres import AsyncSessionLocal
from sqlalchemy import delete
from app.models.journal import Journal

async def test():
    async with AsyncSessionLocal() as db:
        await db.execute(delete(Journal))
        await db.commit()
        print('deleted')

asyncio.run(test())
