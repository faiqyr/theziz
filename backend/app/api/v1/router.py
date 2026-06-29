from fastapi import APIRouter
from app.api.v1.endpoints import documents, chat, generator, scraper, journals

api_router = APIRouter()
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(generator.router, prefix="/generator", tags=["generator"])
api_router.include_router(scraper.router, prefix="/scraper", tags=["scraper"])
api_router.include_router(journals.router, prefix="/journals", tags=["journals"])
