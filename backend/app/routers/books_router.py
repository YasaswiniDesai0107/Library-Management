# ============================================================
# routers/books_router.py
# FastAPI router for all Book-related API endpoints.
# This layer handles HTTP requests/responses and delegates
# database operations to the CRUD layer.
# ============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.book_schema import BookCreate, BookUpdate, BookResponse
from app.crud import book_crud

# Create a router with a URL prefix and tags for Swagger grouping
router = APIRouter(
    prefix="/books",
    tags=["Books"],             # Groups all endpoints under "Books" in Swagger UI
)


# -----------------------------------------------------------
# GET /books
# Retrieve all books with optional pagination
# -----------------------------------------------------------
@router.get(
    "/",
    response_model=List[BookResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all books",
    description="Returns a paginated list of all books in the library.",
)
def get_all_books(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),   # Injects DB session automatically
):
    """
    Retrieve all books.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    return book_crud.get_all_books(db=db, skip=skip, limit=limit)


# -----------------------------------------------------------
# GET /books/{book_id}
# Retrieve a single book by its ID
# -----------------------------------------------------------
@router.get(
    "/{book_id}",
    response_model=BookResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a book by ID",
    description="Returns a single book record by its unique ID.",
)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve a specific book by ID.

    - **book_id**: The unique identifier of the book
    """
    return book_crud.get_book_by_id(db=db, book_id=book_id)


# -----------------------------------------------------------
# POST /books
# Create a new book record
# -----------------------------------------------------------
@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,  # 201 = resource created
    summary="Add a new book",
    description="Creates a new book record in the library database.",
)
def create_book(
    book_data: BookCreate,                 # Pydantic validates the request body
    db: Session = Depends(get_db),
):
    """
    Add a new book to the library.

    Required fields:
    - **title**: Book title
    - **author**: Author's full name

    Optional fields:
    - **category**: Genre or category
    - **isbn**: ISBN number (must be unique)
    - **availability_status**: True (available) or False (borrowed)
    """
    return book_crud.create_book(db=db, book_data=book_data)


# -----------------------------------------------------------
# PUT /books/{book_id}
# Update an existing book
# -----------------------------------------------------------
@router.put(
    "/{book_id}",
    response_model=BookResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a book",
    description="Updates one or more fields of an existing book record.",
)
def update_book(
    book_id: int,
    book_data: BookUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing book by ID.

    - **book_id**: The unique identifier of the book to update
    - All fields in the request body are optional (partial updates supported)
    """
    return book_crud.update_book(db=db, book_id=book_id, book_data=book_data)


# -----------------------------------------------------------
# DELETE /books/{book_id}
# Delete a book by ID
# -----------------------------------------------------------
@router.delete(
    "/{book_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a book",
    description="Permanently removes a book record from the database.",
)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a book by ID.

    - **book_id**: The unique identifier of the book to delete
    """
    return book_crud.delete_book(db=db, book_id=book_id)


# -----------------------------------------------------------
# GET /books/search
# Search books by title, author, or category
# -----------------------------------------------------------
@router.get(
    "/search/find",
    response_model=List[BookResponse],
    summary="Search books",
)
def search_books(
    title: str = None,
    author: str = None,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Search for books using title, author, or category filters."""
    return book_crud.search_books(db, title, author, category)
