# ============================================================
# database.py
# Sets up the SQLAlchemy database engine, session factory,
# and the declarative base class used by all ORM models.
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config.settings import settings

# -----------------------------------------------------------
# 1. ENGINE
# The engine is the core interface to the database.
# `connect_args` is used here for PyMySQL-specific options.
# -----------------------------------------------------------
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,          # Prints SQL queries to console when DEBUG=True
    pool_pre_ping=True,           # Checks connection health before use
    pool_recycle=3600,            # Recycles connections every hour to avoid stale ones
)

# -----------------------------------------------------------
# 2. SESSION FACTORY
# SessionLocal is a factory that produces new DB session objects.
# Each request gets its own session (opened and closed per request).
# autocommit=False → we control when to commit
# autoflush=False  → SQLAlchemy won't auto-write to DB mid-session
# -----------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

# -----------------------------------------------------------
# 3. BASE CLASS
# All ORM model classes will inherit from this Base.
# SQLAlchemy uses it to track all table definitions.
# -----------------------------------------------------------
Base = declarative_base()


# -----------------------------------------------------------
# 4. DEPENDENCY: get_db()
# This is a FastAPI dependency used in route functions.
# It opens a DB session, yields it to the route, then closes it.
# Usage: db: Session = Depends(get_db)
# -----------------------------------------------------------
def get_db():
    """
    Provides a database session for each API request.
    Uses Python's generator pattern to ensure the session
    is always closed — even if an exception occurs.
    """
    db = SessionLocal()
    try:
        yield db          # Hand the session to the route handler
    finally:
        db.close()        # Always close the session after the request ends
