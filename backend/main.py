from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db
from loguru import logger
import sys

# Configure Loguru
logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up the SDG Project Management API...")
    await init_db()
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down the SDG Project Management API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import auth, projects, ml, rag
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(ml.router, prefix="/ml", tags=["ML"])
app.include_router(rag.router, prefix="/rag", tags=["RAG"])

@app.get("/")
async def root():
    return {"message": "Welcome to the SDG Project Management API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
