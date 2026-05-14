# ============================================================
# crud/book_crud.py
# Database operations (CRUD) for the Books module.
# These functions talk directly to the database via SQLAlchemy.
# They are called by the router layer — NOT by the client directly.
# ============================================================

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.book_model import Book
from app.schemas.book_schema import BookCreate, BookUpdate


# -----------------------------------------------------------
# READ: Get all books
# -----------------------------------------------------------
def get_all_books(db: Session, skip: int = 0, limit: int = 100) -> list[Book]:
    """
    Retrieve all books from the database with pagination.

    Args:
        db    : Active database session
        skip  : Number of records to skip (for pagination)
        limit : Maximum records to return

    Returns:
        List of Book ORM objects
    """
    return db.query(Book).offset(skip).limit(limit).all()


# -----------------------------------------------------------
# READ: Get a single book by ID
# -----------------------------------------------------------
def get_book_by_id(db: Session, book_id: int) -> Book:
    """
    Retrieve a single book by its primary key.

    Args:
        db      : Active database session
        book_id : The book's primary key

    Returns:
        Book ORM object

    Raises:
        HTTPException 404 if the book is not found
    """
    book = db.query(Book).filter(Book.book_id == book_id).first()

    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {book_id} not found.",
        )

    return book


# -----------------------------------------------------------
# CREATE: Add a new book
# -----------------------------------------------------------
def create_book(db: Session, book_data: BookCreate) -> Book:
    """
    Insert a new book record into the database.

    Args:
        db        : Active database session
        book_data : Validated data from the BookCreate schema

    Returns:
        The newly created Book ORM object

    Raises:
        HTTPException 400 if ISBN already exists (duplicate)
    """
    # Convert the Pydantic schema into a SQLAlchemy model instance
    new_book = Book(**book_data.model_dump())

    try:
        db.add(new_book)       # Stage the new record
        db.commit()            # Write to the database
        db.refresh(new_book)   # Reload to get the generated book_id
    except IntegrityError:
        db.rollback()          # Undo any partial changes on error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A book with this ISBN already exists.",
        )

    return new_book


# -----------------------------------------------------------
# UPDATE: Modify an existing book
# -----------------------------------------------------------
def update_book(db: Session, book_id: int, book_data: BookUpdate) -> Book:
    """
    Update an existing book record with the provided fields.
    Only non-None fields from book_data will be applied.

    Args:
        db        : Active database session
        book_id   : The book's primary key
        book_data : Validated update data from the BookUpdate schema

    Returns:
        The updated Book ORM object

    Raises:
        HTTPException 404 if the book is not found
        HTTPException 400 if ISBN conflicts with another book
    """
    # First, verify the book exists (raises 404 if not)
    book = get_book_by_id(db, book_id)

    # Get only the fields that were actually provided (exclude unset/None)
    update_fields = book_data.model_dump(exclude_none=True)

    # Apply each provided field to the ORM object
    for field, value in update_fields.items():
        setattr(book, field, value)

    try:
        db.commit()           # Persist the changes
        db.refresh(book)      # Reload to reflect updated state
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A book with this ISBN already exists.",
        )

    return book


# -----------------------------------------------------------
# DELETE: Remove a book by ID
# -----------------------------------------------------------
def delete_book(db: Session, book_id: int) -> dict:
    """
    Delete a book record from the database.

    Args:
        db      : Active database session
        book_id : The book's primary key

    Returns:
        A confirmation message dict

    Raises:
        HTTPException 404 if the book is not found
    """
    # Verify existence before attempting deletion
    book = get_book_by_id(db, book_id)

    db.delete(book)    # Mark for deletion
    db.commit()        # Execute the DELETE statement

    return {"message": f"Book with ID {book_id} has been deleted successfully."}


# -----------------------------------------------------------
# SEARCH: Find books by criteria
# -----------------------------------------------------------
def search_books(db: Session, title: str = None, author: str = None, category: str = None):
    """
    Search books based on multiple optional criteria.
    Uses 'like' for partial matches.
    """
    query = db.query(Book)
    
    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))
    if author:
        query = query.filter(Book.author.ilike(f"%{author}%"))
    if category:
        query = query.filter(Book.category.ilike(f"%{category}%"))
        
    return query.all()
