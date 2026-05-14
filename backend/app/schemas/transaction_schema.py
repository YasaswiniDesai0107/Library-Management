# ============================================================
# schemas/transaction_schema.py
# Pydantic schemas for Transactions.
# ============================================================

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .book_schema import BookResponse
from .borrower_schema import BorrowerResponse


# -----------------------------------------------------------
# BASE SCHEMA
# -----------------------------------------------------------
class TransactionBase(BaseModel):
    book_id: int
    borrower_id: int


# -----------------------------------------------------------
# CREATE SCHEMA (For Borrowing)
# -----------------------------------------------------------
class TransactionCreate(TransactionBase):
    pass


# -----------------------------------------------------------
# RESPONSE SCHEMA
# -----------------------------------------------------------
class TransactionResponse(TransactionBase):
    transaction_id: int
    borrow_date: datetime
    return_date: Optional[datetime] = None
    
    # Step-3: Nested objects for better frontend display
    book: Optional[BookResponse] = None
    borrower: Optional[BorrowerResponse] = None

    class Config:
        from_attributes = True
