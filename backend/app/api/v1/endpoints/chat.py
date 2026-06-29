from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    document_ids: List[str]
    message: str
    model: Optional[str] = "qwen:latest"

class Citation(BaseModel):
    document_id: str
    page_number: int
    text_snippet: str

class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    citations: List[Citation]
    latency_ms: int

@router.post("/", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """
    Chat with uploaded documents using RAG.
    Returns page-level citations for every answer.
    """
    if not request.document_ids:
        raise HTTPException(status_code=400, detail="Must provide at least one document ID.")
    
    # Placeholder response to fulfill MVP structure
    # In reality, this would call rag_service.chat_with_docs(...)
    return ChatResponse(
        conversation_id=request.conversation_id or "new_conv_id",
        answer="This is a synthesized answer from the research paper using Qwen3.",
        citations=[
            Citation(
                document_id=request.document_ids[0],
                page_number=3,
                text_snippet="...the proposed AI architecture improves latency by 15%..."
            )
        ],
        latency_ms=1250
    )
