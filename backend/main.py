# backend/main.py – FastAPI application entry point

"""Main entry point for the Verix backend.

The application uses:
- SQLAlchemy for the SQLite database (see `sql_app` package)
- Alembic for migrations (initial migration will be generated later)
- A dedicated router (`backend/api/router.py`) that implements the core endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .sql_app import models
from .sql_app.database import engine
from .api.router import router as api_router

# Create all tables (for development; in production use Alembic migrations)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Verix API",
    description="API for Verix – Skills You Can Verify",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8443", "http://127.0.0.1:8443", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include the modular router
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Verix API!"}

# The ASGI server can be started with:
#   uvicorn backend.main:app --reload
