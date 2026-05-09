import pytest
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from httpx import AsyncClient
from main import app
from app.models.user import User
from app.models.project import Project
from app.models.literature import LiteratureDocument
from app.core.config import settings

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    # Use a separate test database
    await init_beanie(
        database=client.test_db,
        document_models=[User, Project, LiteratureDocument]
    )
    yield client.test_db
    await client.drop_database("test_db")

import pytest_asyncio
import httpx

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
