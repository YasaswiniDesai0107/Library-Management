# ============================================================
# routers/transactions_router.py
# API endpoints for borrowing, returning, and history.
# ============================================================

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.transaction_schema import TransactionResponse, TransactionCreate
from app.crud import transaction_crud

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)

@router.get("/", response_model=List[TransactionResponse])
def get_all_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve full transaction history."""
    return transaction_crud.get_transactions(db, skip, limit)

@router.post("/borrow", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def borrow_book(data: TransactionCreate, db: Session = Depends(get_db)):
    """Borrow a book: Check availability -> Update status -> Create record."""
    return transaction_crud.borrow_book(db, data.book_id, data.borrower_id)

@router.post("/return/{book_id}", response_model=TransactionResponse)
def return_book(book_id: int, db: Session = Depends(get_db)):
    """Return a book: Set return date -> Mark book as available."""
    return transaction_crud.return_book(db, book_id)
