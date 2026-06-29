# Theziz - AI Research Assistant

Theziz is a production-ready AI Research Assistant that helps researchers upload academic papers, extract insights, and chat with them using Retrieval-Augmented Generation (RAG). It provides page-level citations, summaries, comparisons, and evaluation metrics.

## Features

1. **Upload Papers**: Extract and chunk PDF content automatically.
2. **Qdrant Vector DB**: Store embeddings efficiently.
3. **RAG Chat**: Chat with uploaded papers with exact page-level citations.
4. **Structured Summaries & Comparisons**: Summarize papers or compare multiple papers.
5. **Literature Review**: Generate automated literature reviews.
6. **Multi-LLM Support**: Supports Qwen3 (default), Llama, and Gemma via Ollama.
7. **Model Evaluation Dashboard**: View metrics like Faithfulness, Context Precision, Answer Relevancy, and Latency.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI

### Backend
- **Framework**: FastAPI (Python 3.11)
- **AI/LLM**: LangChain, LangGraph, Ollama (Qwen3)
- **Database**: PostgreSQL (Relational) & Qdrant (Vector)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11
- Docker & Docker Compose
- Ollama installed locally

### 1. Start Databases & Backend
Start PostgreSQL and Qdrant using Docker Compose:
```bash
docker-compose up -d
```

Setup the Python environment and run FastAPI:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend
In a new terminal:
```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000/dashboard/research` to access the Research Assistant.

## Architecture

* **Clean Architecture**: Separation of concerns between API routing, business logic (Services), and database operations.
* **Dependency Injection**: Used heavily in FastAPI for database sessions.
* **Async RAG Pipeline**: LangChain is used for chunking, Ollama for embeddings and generation.
