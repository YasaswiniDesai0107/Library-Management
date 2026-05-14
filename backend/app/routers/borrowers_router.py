# ============================================================
# routers/borrowers_router.py
# FastAPI router for all Borrower-related API endpoints.
# This layer handles HTTP requests/responses and delegates
# database operations to the CRUD layer.
# ============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.borrower_schema import BorrowerCreate, BorrowerUpdate, BorrowerResponse
from app.crud import borrower_crud

# Create a router with a URL prefix and tags for Swagger grouping
router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"],         # Groups all endpoints under "Borrowers" in Swagger UI
)


# -----------------------------------------------------------
# GET /borrowers
# Retrieve all borrowers with optional pagination
# -----------------------------------------------------------
@router.get(
    "/",
    response_model=List[BorrowerResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all borrowers",
    description="Returns a paginated list of all registered borrowers.",
)
def get_all_borrowers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    Retrieve all library borrowers.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    return borrower_crud.get_all_borrowers(db=db, skip=skip, limit=limit)


# -----------------------------------------------------------
# POST /borrowers
# Register a new borrower
# -----------------------------------------------------------
@router.post(
    "/",
    response_model=BorrowerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new borrower",
    description="Creates a new borrower (library member) record.",
)
def create_borrower(
    borrower_data: BorrowerCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new library borrower.

    Required fields:
    - **borrower_name**: Full name of the borrower
    - **email**: Valid email address (must be unique)

    Optional fields:
    - **phone**: Contact phone number
    """
    return borrower_crud.create_borrower(db=db, borrower_data=borrower_data)


# -----------------------------------------------------------
# PUT /borrowers/{borrower_id}
# Update an existing borrower's information
# -----------------------------------------------------------
@router.put(
    "/{borrower_id}",
    response_model=BorrowerResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a borrower",
    description="Updates one or more fields of an existing borrower record.",
)
def update_borrower(
    borrower_id: int,
    borrower_data: BorrowerUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing borrower by ID.

    - **borrower_id**: The unique identifier of the borrower to update
    - All fields in the request body are optional (partial updates supported)
    """
    return borrower_crud.update_borrower(
        db=db,
        borrower_id=borrower_id,
        borrower_data=borrower_data,
    )


# -----------------------------------------------------------
# DELETE /borrowers/{borrower_id}
# Delete a borrower by ID
# -----------------------------------------------------------
@router.delete(
    "/{borrower_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a borrower",
    description="Permanently removes a borrower record from the database.",
)
def delete_borrower(
    borrower_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a borrower by ID.

    - **borrower_id**: The unique identifier of the borrower to delete
    """
    return borrower_crud.delete_borrower(db=db, borrower_id=borrower_id)
