# ============================================================
# models/transaction_model.py
# SQLAlchemy ORM model for the 'transactions' table.
# Tracks the borrowing and returning history of books.
# ============================================================

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Transaction(Base):
    """
    Represents a borrow/return transaction in the library.

    Columns:
        transaction_id - Primary key
        book_id        - Foreign key to books table
        borrower_id    - Foreign key to borrowers table
        borrow_date    - Date/time the book was borrowed (defaults to now)
        return_date    - Date/time the book was returned (null if not yet returned)
    """

    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign Keys
    book_id = Column(Integer, ForeignKey("books.book_id"), nullable=False)
    borrower_id = Column(Integer, ForeignKey("borrowers.borrower_id"), nullable=False)
    
    # Timestamps
    borrow_date = Column(DateTime(timezone=True), server_default=func.now())
    return_date = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    # Allows accessing transaction.book and transaction.borrower directly
    book = relationship("Book", back_populates="transactions")
    borrower = relationship("Borrower", back_populates="transactions")
