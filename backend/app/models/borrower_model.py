# ============================================================
# models/borrower_model.py
# SQLAlchemy ORM model for the 'borrowers' table.
# This class maps directly to the 'borrowers' table in MySQL.
# ============================================================

from sqlalchemy import Column, Integer, String
from app.database import Base


class Borrower(Base):
    """
    Represents a library borrower (member) in the database.

    Columns:
        borrower_id   - Primary key, auto-incremented integer
        borrower_name - Full name of the borrower (required)
        email         - Email address (unique, required)
        phone         - Contact phone number (optional)
    """

    # The name of the table in MySQL
    __tablename__ = "borrowers"

    # Primary key — auto-incremented by the database
    borrower_id = Column(
        Integer,
        primary_key=True,
        index=True,          # Creates a DB index for fast lookups
        autoincrement=True,
    )

    # Full name of the borrower — cannot be null
    borrower_name = Column(
        String(255),
        nullable=False,
    )

    # Email address — must be unique across all borrowers
    email = Column(
        String(255),
        unique=True,         # No two borrowers can share the same email
        nullable=False,
        index=True,          # Indexed for fast email-based lookups
    )

    # Phone number — optional contact info
    phone = Column(
        String(20),
        nullable=True,
    )
