import uuid
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from typing import List

router = APIRouter()

# Mocking a simple DB in-memory for the MVP structure
# In production, use SQLAlchemy Session injected via Dependencies
fake_documents_db = {}

@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload a PDF document, extract text, chunk it, and store embeddings.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    doc_id = str(uuid.uuid4())
    
    # Save file temporarily (in a real app, use S3/Blob storage or proper temp directory)
    file_location = f"/tmp/{doc_id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        
    # Create DB record with status "processing"
    fake_documents_db[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "status": "processing",
        "summary": None
    }
    
    # Kick off background task for processing (extraction, chunking, embedding)
    # background_tasks.add_task(process_document, doc_id, file_location)
    
    return {"message": "Document uploaded and processing started.", "document_id": doc_id}

@router.get("/")
async def list_documents():
    """
    List all uploaded documents.
    """
    return {"documents": list(fake_documents_db.values())}

@router.get("/{document_id}")
async def get_document(document_id: str):
    """
    Get a specific document.
    """
    if document_id not in fake_documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    return fake_documents_db[document_id]
