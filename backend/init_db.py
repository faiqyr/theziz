import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.db.postgres import Base, engine
from app.models.journal import Journal
from app.models.document import Document, Conversation, Message, Evaluation

async def init_models():
    print("Menciptakan tabel-tabel di database (jika belum ada)...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Selesai! Tabel database berhasil dibuat.")

if __name__ == "__main__":
    asyncio.run(init_models())
