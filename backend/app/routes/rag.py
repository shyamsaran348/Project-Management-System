import io
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Annotated, List, Tuple
from uuid import uuid4

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, BackgroundTasks
from fastapi.responses import FileResponse
from groq import Groq
from pydantic import BaseModel
from pypdf import PdfReader

from app.core.config import settings
from app.models.literature import LiteratureDocument
from app.models.project import Project
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas import RagQueryRequest
from app.utils import get_link_id as _get_link_id, is_project_participant as _is_project_participant

router = APIRouter()

MAX_FILE_SIZE = 15 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md"}
TOKEN_PATTERN = re.compile(r"[a-z0-9]+")
CHUNK_SIZE = 600
CHUNK_OVERLAP = 120
DEFAULT_TOP_K = 4
LITERATURE_UPLOAD_ROOT = Path(__file__).resolve().parent.parent.parent / "uploads" / "literature"

logger = logging.getLogger(__name__)


def _extract_text(filename: str, content: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages).strip()
    return content.decode("utf-8", errors="ignore").strip()


def _extract_pdf_text_and_metadata(content: bytes) -> Tuple[str, dict]:
    reader = PdfReader(io.BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    meta = reader.metadata or {}

    title = str(meta.get("/Title", "") or "").strip()
    author = str(meta.get("/Author", "") or "").strip()
    subject = str(meta.get("/Subject", "") or "").strip()
    keywords = str(meta.get("/Keywords", "") or "").strip()

    return "\n".join(pages).strip(), {
        "title": title,
        "author": author,
        "subject": subject,
        "keywords": keywords,
    }


def _metadata_chunk(filename: str, meta: dict) -> str:
    title = (meta.get("title") or "").strip() or filename
    author = (meta.get("author") or "").strip() or "Unknown"
    subject = (meta.get("subject") or "").strip() or "Not specified"
    keywords = (meta.get("keywords") or "").strip() or "Not specified"
    return (
        f"Paper metadata: Title: {title}. Author: {author}. "
        f"Subject: {subject}. Keywords: {keywords}."
    )


def _chunk_text(text: str) -> List[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []
    chunks = []
    start = 0
    while start < len(cleaned):
        end = min(len(cleaned), start + CHUNK_SIZE)
        chunks.append(cleaned[start:end].strip())
        if end == len(cleaned):
            break
        start = max(0, end - CHUNK_OVERLAP)
    return [c for c in chunks if c]


def _score_chunk(query: str, chunk: str) -> int:
    q_terms = TOKEN_PATTERN.findall(query.lower())
    c_text = chunk.lower()
    score = 0
    for term in q_terms:
        if len(term) < 3:
            continue
        score += c_text.count(term)
    if query.lower() in c_text:
        score += 5
    return score


def _retrieve_top_chunks(query: str, chunks: List[str], top_k: int) -> List[str]:
    scored = [(self_score, chunk) for chunk in chunks if (self_score := _score_chunk(query, chunk)) > 0]
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:top_k]]


def _fallback_chunks(chunks: List[str], top_k: int) -> List[str]:
    if not chunks:
        return []
    if len(chunks) <= top_k:
        return chunks
    step = max(1, len(chunks) // top_k)
    selected = [chunks[i] for i in range(0, len(chunks), step)]
    return selected[:top_k]


class RagUploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks_indexed: int
    paper_title: str = ""
    paper_author: str = ""


class RagDocumentView(BaseModel):
    id: str
    filename: str
    uploaded_by: str
    created_at: datetime
    chunks_count: int
    paper_title: str = ""
    paper_author: str = ""


class RagQueryResponse(BaseModel):
    answer: str


@router.post("/projects/{project_id}/documents", response_model=RagUploadResponse)
async def upload_literature_document(
    project_id: PydanticObjectId,
    current_user: Annotated[User, Depends(get_current_user)],
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not _is_project_participant(project, current_user):
        raise HTTPException(status_code=403, detail="Not allowed")

    filename = (file.filename or "").strip()
    ext = "." + filename.lower().split(".")[-1] if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and MD files are supported")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 15 MB size limit")

    storage_name = f"{uuid4()}{ext}"
    doc = LiteratureDocument(
        project_id=str(project_id),
        filename=filename,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        uploaded_by=current_user.full_name,
        storage_filename=storage_name,
        status="processing",
    )

    project_dir = LITERATURE_UPLOAD_ROOT / str(project_id)
    project_dir.mkdir(parents=True, exist_ok=True)
    file_path = project_dir / storage_name
    file_path.write_bytes(content)

    await doc.insert()

    if background_tasks:
        background_tasks.add_task(process_document_task, str(doc.id), content, filename, ext)

    return RagUploadResponse(
        document_id=str(doc.id),
        filename=doc.filename,
        chunks_indexed=0,
        paper_title=filename,
        paper_author="Processing...",
    )


async def process_document_task(doc_id: str, content: bytes, filename: str, ext: str):
    try:
        metadata: dict = {"title": "", "author": "", "subject": "", "keywords": ""}
        if ext == ".pdf":
            text, metadata = _extract_pdf_text_and_metadata(content)
        else:
            text = _extract_text(filename, content)

        chunks = _chunk_text(text)
        if chunks:
            chunks.insert(0, _metadata_chunk(filename, metadata))

        doc = await LiteratureDocument.get(PydanticObjectId(doc_id))
        if doc:
            doc.chunks = chunks
            doc.paper_title = (metadata.get("title") or "").strip() or filename
            doc.paper_author = (metadata.get("author") or "").strip() or "Unknown"
            doc.status = "indexed"
            await doc.save()
    except Exception as e:
        logger.error(f"Failed to process document {doc_id}: {e}")
        doc = await LiteratureDocument.get(PydanticObjectId(doc_id))
        if doc:
            doc.status = "failed"
            await doc.save()


@router.get("/projects/{project_id}/documents", response_model=List[RagDocumentView])
async def list_literature_documents(
    project_id: PydanticObjectId,
    current_user: Annotated[User, Depends(get_current_user)],
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not _is_project_participant(project, current_user):
        raise HTTPException(status_code=403, detail="Not allowed")

    docs = await LiteratureDocument.find(
        LiteratureDocument.project_id == str(project_id)
    ).sort(-LiteratureDocument.created_at).to_list()

    return [
        RagDocumentView(
            id=str(d.id),
            filename=d.filename,
            uploaded_by=d.uploaded_by,
            created_at=d.created_at,
            chunks_count=len(d.chunks or []),
            paper_title=d.paper_title or d.filename,
            paper_author=d.paper_author or "Unknown",
        )
        for d in docs
    ]


@router.delete("/projects/{project_id}/documents/{document_id}")
async def delete_literature_document(
    project_id: PydanticObjectId,
    document_id: PydanticObjectId,
    current_user: Annotated[User, Depends(get_current_user)],
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not _is_project_participant(project, current_user):
        raise HTTPException(status_code=403, detail="Not allowed")

    doc = await LiteratureDocument.get(document_id)
    if not doc or doc.project_id != str(project_id):
        raise HTTPException(status_code=404, detail="Literature document not found")

    file_path = LITERATURE_UPLOAD_ROOT / str(project_id) / doc.storage_filename
    if file_path.exists():
        file_path.unlink()

    await doc.delete()
    return {"message": "Document deleted successfully"}


@router.get("/projects/{project_id}/documents/{document_id}/download")
async def download_literature_document(
    project_id: PydanticObjectId,
    document_id: PydanticObjectId,
    current_user: Annotated[User, Depends(get_current_user)],
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not _is_project_participant(project, current_user):
        raise HTTPException(status_code=403, detail="Not allowed")

    doc = await LiteratureDocument.get(document_id)
    if not doc or doc.project_id != str(project_id):
        raise HTTPException(status_code=404, detail="Literature document not found")

    file_path = LITERATURE_UPLOAD_ROOT / str(project_id) / doc.storage_filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Stored file not found")

    return FileResponse(
        path=str(file_path),
        media_type=doc.content_type or "application/octet-stream",
        filename=doc.filename,
    )


@router.post("/projects/{project_id}/query", response_model=RagQueryResponse)
async def literature_query(
    project_id: PydanticObjectId,
    payload: RagQueryRequest,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not _is_project_participant(project, current_user):
        raise HTTPException(status_code=403, detail="Not allowed")

    query = (payload.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    top_k = payload.top_k if payload.top_k and payload.top_k > 0 else DEFAULT_TOP_K

    docs = await LiteratureDocument.find(
        LiteratureDocument.project_id == str(project_id)
    ).to_list()
    if not docs:
        raise HTTPException(status_code=400, detail="No literature uploaded for this project yet")

    all_chunks: List[str] = []
    for doc in docs:
        all_chunks.extend(doc.chunks or [])

    top_chunks = _retrieve_top_chunks(query, all_chunks, top_k)
    if not top_chunks:
        top_chunks = _fallback_chunks(all_chunks, top_k)

    context = "\n\n".join(top_chunks)

    client = Groq(api_key=settings.GROQ_API_KEY)
    system_prompt = (
        "You are a literature-survey assistant for academic research papers. "
        "Write in a formal research style with moderate detail and clear reasoning. "
        "Reply with plain text only: no headings, bullets, markdown, or labels. "
        "Ground the answer in the retrieved paper context, synthesize findings, and avoid unsupported claims."
    )
    user_prompt = (
        f"Research question:\n{query}\n\n"
        f"Retrieved paper context:\n{context}\n\n"
        "Write a concise-but-detailed literature style answer (around 120-220 words when possible) that: "
        "summarizes relevant evidence, explains the rationale, notes assumptions or limitations if needed, "
        "and directly answers the question using the provided context."
    )

    try:
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            temperature=0.2,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Groq request failed: {exc}") from exc

    answer = (completion.choices[0].message.content or "").strip()
    if not answer:
        raise HTTPException(status_code=502, detail="Groq returned an empty response")

    return RagQueryResponse(answer=answer)
