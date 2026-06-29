import fitz  # PyMuPDF
from typing import List, Dict, Any
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from app.db.qdrant_client import get_qdrant_client
# from langchain_community.embeddings import OllamaEmbeddings
# from app.core.config import settings

async def process_document(doc_id: str, file_path: str):
    """
    Background task to process uploaded PDF.
    1. Extract text page by page.
    2. Chunk text keeping page numbers.
    3. Embed using Ollama.
    4. Store in Qdrant.
    """
    print(f"Starting processing for document {doc_id}")
    
    # --- Step 1: Extraction ---
    pages_data = extract_text_from_pdf(file_path)
    
    # --- Step 2: Chunking ---
    chunks = chunk_text(pages_data)
    
    # --- Step 3 & 4: Embedding and Storage ---
    # In production, we'd use LangChain's OllamaEmbeddings and Qdrant client
    # embeddings = OllamaEmbeddings(model=settings.DEFAULT_EMBEDDING_MODEL, base_url=settings.OLLAMA_BASE_URL)
    # qdrant = get_qdrant_client()
    # qdrant.add_documents(chunks)
    
    print(f"Finished processing for document {doc_id}")
    # Update DB status to 'ready'

def extract_text_from_pdf(file_path: str) -> List[Dict[str, Any]]:
    pages_data = []
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text()
            pages_data.append({
                "page_number": page_num + 1,
                "text": text
            })
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return pages_data

def chunk_text(pages_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = []
    for page in pages_data:
        # texts = splitter.split_text(page["text"])
        # for text in texts:
        #     chunks.append({
        #         "text": text,
        #         "page_number": page["page_number"]
        #     })
        # Mock chunking
        chunks.append({
            "text": page["text"][:100], # just a mock text slice
            "page_number": page["page_number"]
        })
    return chunks
