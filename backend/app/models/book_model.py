# ============================================================
# models/book_model.py
# SQLAlchemy ORM model for the 'books' table.
# This class maps directly to the 'books' table in MySQL.
# ============================================================

from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database import Base


class Book(Base):
    """
    Represents a book record in the library database.

    Columns:
        book_id         - Primary key, auto-incremented integer
        title           - Title of the book (required)
        author          - Author name (required)
        category        - Genre/category (e.g., Fiction, Science, History)
        isbn            - International Standard Book Number (unique)
        availability_status - True = available, False = currently borrowed
    """

    # The name of the table in MySQL
    __tablename__ = "books"

    # Primary key — auto-incremented by the database
    book_id = Column(
        Integer,
        primary_key=True,
        index=True,          # Creates a DB index for fast lookups
        autoincrement=True,
    )

    # Title of the book — cannot be null
    title = Column(
        String(255),
        nullable=False,
    )

    # Author name — cannot be null
    author = Column(
        String(255),
        nullable=False,
    )

    # Category/genre of the book — optional field
    category = Column(
        String(100),
        nullable=True,
    )

    # ISBN: unique identifier for each edition of a book
    isbn = Column(
        String(20),
        unique=True,         # No two books can share the same ISBN
        nullable=True,
    )

    # Availability: True = book is on the shelf, False = checked out
    # Defaults to True (available) when a new book is added
    availability_status = Column(
        Boolean,
        default=True,
        nullable=False,
    )
