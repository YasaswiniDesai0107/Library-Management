# ============================================================
# schemas/book_schema.py
# Pydantic schemas for Books.
# These schemas define the shape of data coming IN (requests)
# and going OUT (responses) for all Book-related API endpoints.
# ============================================================

from pydantic import BaseModel, Field
from typing import Optional


# -----------------------------------------------------------
# BASE SCHEMA
# Contains fields shared by both Create and Update schemas.
# -----------------------------------------------------------
class BookBase(BaseModel):
    """
    Common fields shared across Book request schemas.
    """
    title: str = Field(
        ...,                        # '...' means this field is REQUIRED
        min_length=1,
        max_length=255,
        description="Title of the book",
        examples=["The Great Gatsby"],
    )
    author: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Full name of the author",
        examples=["F. Scott Fitzgerald"],
    )
    category: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Genre or category (e.g., Fiction, Science)",
        examples=["Fiction"],
    )
    isbn: Optional[str] = Field(
        default=None,
        max_length=20,
        description="International Standard Book Number",
        examples=["978-0-7432-7356-5"],
    )
    availability_status: bool = Field(
        default=True,
        description="True if available on shelf, False if borrowed",
    )


# -----------------------------------------------------------
# CREATE SCHEMA
# Used when a client sends a POST /books request.
# Inherits all fields from BookBase.
# -----------------------------------------------------------
class BookCreate(BookBase):
    """
    Schema for creating a new book.
    Inherits all fields from BookBase.
    """
    pass  # All fields from BookBase apply here


# -----------------------------------------------------------
# UPDATE SCHEMA
# Used when a client sends a PUT /books/{id} request.
# All fields are optional so partial updates are possible.
# -----------------------------------------------------------
class BookUpdate(BaseModel):
    """
    Schema for updating an existing book.
    All fields are optional to support partial (PATCH-style) updates.
    """
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated title of the book",
    )
    author: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated author name",
    )
    category: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Updated category/genre",
    )
    isbn: Optional[str] = Field(
        default=None,
        max_length=20,
        description="Updated ISBN",
    )
    availability_status: Optional[bool] = Field(
        default=None,
        description="Updated availability status",
    )


# -----------------------------------------------------------
# RESPONSE SCHEMA
# Used when the API returns a book to the client.
# Includes the book_id assigned by the database.
# -----------------------------------------------------------
class BookResponse(BookBase):
    """
    Schema for returning a book record in API responses.
    Adds the database-generated book_id field.
    """
    book_id: int = Field(description="Auto-generated primary key")

    class Config:
        # from_attributes=True allows Pydantic to read data from
        # SQLAlchemy ORM model instances (not just plain dicts).
        from_attributes = True
