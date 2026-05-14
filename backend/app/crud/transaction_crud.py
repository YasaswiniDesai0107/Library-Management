# ============================================================
# crud/transaction_crud.py
# Business logic for borrowing and returning books.
# ============================================================

from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi import HTTPException, status
from app.models.transaction_model import Transaction
from app.models.book_model import Book
from app.models.borrower_model import Borrower


def borrow_book(db: Session, book_id: int, borrower_id: int):
    """
    Workflow for borrowing a book:
    1. Check if book exists and is available
    2. Check if borrower exists
    3. Create transaction
    4. Update book status
    """
    # 1. Fetch book
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.availability_status:
        raise HTTPException(status_code=400, detail="Book is already borrowed")

    # 2. Fetch borrower
    borrower = db.query(Borrower).filter(Borrower.borrower_id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")

    # 3. Create Transaction
    new_transaction = Transaction(book_id=book_id, borrower_id=borrower_id)
    db.add(new_transaction)

    # 4. Update Book Status
    book.availability_status = False
    
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


def return_book(db: Session, book_id: int):
    """
    Workflow for returning a book:
    1. Find the active transaction (where return_date is null)
    2. Set return_date to now
    3. Update book status to available
    """
    # 1. Find active transaction
    transaction = db.query(Transaction).filter(
        Transaction.book_id == book_id,
        Transaction.return_date == None
    ).order_by(Transaction.borrow_date.desc()).first()

    if not transaction:
        raise HTTPException(status_code=400, detail="No active borrow record found for this book")

    # 2. Update Transaction
    transaction.return_date = func.now()

    # 3. Update Book
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if book:
        book.availability_status = True

    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    """Get all transaction history with related book and borrower info."""
    return db.query(Transaction).offset(skip).limit(limit).all()
