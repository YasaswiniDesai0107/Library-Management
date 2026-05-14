# ============================================================
# crud/borrower_crud.py
# Database operations (CRUD) for the Borrowers module.
# These functions talk directly to the database via SQLAlchemy.
# They are called by the router layer — NOT by the client directly.
# ============================================================

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.borrower_model import Borrower
from app.schemas.borrower_schema import BorrowerCreate, BorrowerUpdate


# -----------------------------------------------------------
# READ: Get all borrowers
# -----------------------------------------------------------
def get_all_borrowers(db: Session, skip: int = 0, limit: int = 100) -> list[Borrower]:
    """
    Retrieve all borrowers from the database with pagination.

    Args:
        db    : Active database session
        skip  : Number of records to skip (for pagination)
        limit : Maximum records to return

    Returns:
        List of Borrower ORM objects
    """
    return db.query(Borrower).offset(skip).limit(limit).all()


# -----------------------------------------------------------
# READ: Get a single borrower by ID
# -----------------------------------------------------------
def get_borrower_by_id(db: Session, borrower_id: int) -> Borrower:
    """
    Retrieve a single borrower by their primary key.

    Args:
        db          : Active database session
        borrower_id : The borrower's primary key

    Returns:
        Borrower ORM object

    Raises:
        HTTPException 404 if the borrower is not found
    """
    borrower = db.query(Borrower).filter(Borrower.borrower_id == borrower_id).first()

    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrower with ID {borrower_id} not found.",
        )

    return borrower


# -----------------------------------------------------------
# CREATE: Register a new borrower
# -----------------------------------------------------------
def create_borrower(db: Session, borrower_data: BorrowerCreate) -> Borrower:
    """
    Insert a new borrower record into the database.

    Args:
        db            : Active database session
        borrower_data : Validated data from the BorrowerCreate schema

    Returns:
        The newly created Borrower ORM object

    Raises:
        HTTPException 400 if email already exists (duplicate)
    """
    # Convert the Pydantic schema into a SQLAlchemy model instance
    new_borrower = Borrower(**borrower_data.model_dump())

    try:
        db.add(new_borrower)          # Stage the new record
        db.commit()                   # Write to the database
        db.refresh(new_borrower)      # Reload to get the generated borrower_id
    except IntegrityError:
        db.rollback()                 # Undo any partial changes on error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A borrower with this email address already exists.",
        )

    return new_borrower


# -----------------------------------------------------------
# UPDATE: Modify an existing borrower
# -----------------------------------------------------------
def update_borrower(db: Session, borrower_id: int, borrower_data: BorrowerUpdate) -> Borrower:
    """
    Update an existing borrower record with the provided fields.
    Only non-None fields from borrower_data will be applied.

    Args:
        db            : Active database session
        borrower_id   : The borrower's primary key
        borrower_data : Validated update data from the BorrowerUpdate schema

    Returns:
        The updated Borrower ORM object

    Raises:
        HTTPException 404 if the borrower is not found
        HTTPException 400 if email conflicts with another borrower
    """
    # First, verify the borrower exists (raises 404 if not)
    borrower = get_borrower_by_id(db, borrower_id)

    # Get only the fields that were actually provided (exclude unset/None)
    update_fields = borrower_data.model_dump(exclude_none=True)

    # Apply each provided field to the ORM object
    for field, value in update_fields.items():
        setattr(borrower, field, value)

    try:
        db.commit()               # Persist the changes
        db.refresh(borrower)      # Reload to reflect updated state
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A borrower with this email address already exists.",
        )

    return borrower


# -----------------------------------------------------------
# DELETE: Remove a borrower by ID
# -----------------------------------------------------------
def delete_borrower(db: Session, borrower_id: int) -> dict:
    """
    Delete a borrower record from the database.

    Args:
        db          : Active database session
        borrower_id : The borrower's primary key

    Returns:
        A confirmation message dict

    Raises:
        HTTPException 404 if the borrower is not found
    """
    # Verify existence before attempting deletion
    borrower = get_borrower_by_id(db, borrower_id)

    db.delete(borrower)    # Mark for deletion
    db.commit()            # Execute the DELETE statement

    return {"message": f"Borrower with ID {borrower_id} has been deleted successfully."}
