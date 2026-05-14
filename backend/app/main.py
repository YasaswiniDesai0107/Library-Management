# ============================================================
# main.py
# Entry point of the FastAPI application.
# This file:
#   - Creates the FastAPI app instance
#   - Configures CORS middleware
#   - Registers all routers
#   - Creates database tables on startup
#   - Defines global exception handlers
# ============================================================

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.config.settings import settings
from app.database import engine, Base
from app.routers import books_router, borrowers_router, transactions_router

# -----------------------------------------------------------
# Import all models so SQLAlchemy knows about them
# before creating tables. This is required for Base.metadata
# to discover all table definitions.
# -----------------------------------------------------------
from app.models import book_model, borrower_model, transaction_model  # noqa: F401


# -----------------------------------------------------------
# 1. CREATE ALL TABLES
# SQLAlchemy reads all imported models and creates their
# corresponding tables in MySQL if they don't already exist.
# -----------------------------------------------------------
Base.metadata.create_all(bind=engine)


# -----------------------------------------------------------
# 2. INITIALIZE FastAPI APPLICATION
# -----------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "## Library Management System API\n\n"
        "A RESTful backend API for managing library books and borrowers.\n\n"
        "### Features\n"
        "- **Books**: Full CRUD operations for library books\n"
        "- **Borrowers**: Register and manage library members\n\n"
        "Built with FastAPI + SQLAlchemy + MySQL"
    ),
    docs_url="/docs",         # Swagger UI available at /docs
    redoc_url="/redoc",       # ReDoc UI available at /redoc
    openapi_url="/openapi.json",
)


# -----------------------------------------------------------
# 3. CORS MIDDLEWARE
# Allows frontend apps (React, Vue, etc.) to call this API
# from a different domain/port without browser CORS errors.
# For production, replace "*" with specific allowed origins.
# -----------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # Allow all origins (update for production)
    allow_credentials=True,
    allow_methods=["*"],            # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],            # Allow all headers
)


# -----------------------------------------------------------
# 4. GLOBAL EXCEPTION HANDLERS
# Centralized error handling — these catch unhandled errors
# and return clean JSON responses instead of raw tracebacks.
# -----------------------------------------------------------
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """
    Catches unexpected SQLAlchemy database errors.
    Returns a 500 Internal Server Error with a safe message.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Database error",
            "detail": "An unexpected database error occurred. Please try again later.",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled Python exceptions.
    Returns a 500 Internal Server Error with a safe message.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": "An unexpected error occurred. Please contact support.",
        },
    )


# -----------------------------------------------------------
# 5. REGISTER ROUTERS
# Attach each module's router to the main application.
# All book endpoints will be under /books
# All borrower endpoints will be under /borrowers
# -----------------------------------------------------------
app.include_router(books_router.router)
app.include_router(borrowers_router.router)
app.include_router(transactions_router.router)


# -----------------------------------------------------------
# 6. ROOT ENDPOINT
# A simple health-check endpoint to verify the API is running.
# -----------------------------------------------------------
@app.get(
    "/",
    tags=["Health"],
    summary="API Health Check",
    description="Returns a welcome message confirming the API is live.",
)
def root():
    """
    Health check endpoint.
    Returns the API name, version, and links to documentation.
    """
    return {
        "message": f"Welcome to the {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "status": "running",
    }


# -----------------------------------------------------------
# 7. STARTUP & SHUTDOWN EVENTS
# -----------------------------------------------------------
@app.on_event("startup")
async def on_startup():
    """
    Runs when the FastAPI application starts.
    Good place for initialization logic (e.g., seeding data).
    """
    print(f"✅ {settings.APP_NAME} v{settings.APP_VERSION} is starting up...")
    print("✅ Database tables created successfully.")
    print("✅ API is ready. Visit http://localhost:8000/docs for Swagger UI.")


@app.on_event("shutdown")
async def on_shutdown():
    """
    Runs when the FastAPI application shuts down.
    Good place for cleanup (e.g., closing connections).
    """
    print(f"🛑 {settings.APP_NAME} is shutting down...")
