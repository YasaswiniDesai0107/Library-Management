# ============================================================
# schemas/borrower_schema.py
# Pydantic schemas for Borrowers.
# These schemas define the shape of data coming IN (requests)
# and going OUT (responses) for all Borrower-related API endpoints.
# ============================================================

from pydantic import BaseModel, Field, EmailStr
from typing import Optional


# -----------------------------------------------------------
# BASE SCHEMA
# Contains fields shared by both Create and Update schemas.
# -----------------------------------------------------------
class BorrowerBase(BaseModel):
    """
    Common fields shared across Borrower request schemas.
    """
    borrower_name: str = Field(
        ...,                        # '...' means this field is REQUIRED
        min_length=1,
        max_length=255,
        description="Full name of the borrower",
        examples=["Alice Johnson"],
    )
    email: EmailStr = Field(
        ...,
        description="Valid email address of the borrower",
        examples=["alice@example.com"],
    )
    phone: Optional[str] = Field(
        default=None,
        max_length=20,
        description="Contact phone number (optional)",
        examples=["+1-555-123-4567"],
    )


# -----------------------------------------------------------
# CREATE SCHEMA
# Used when a client sends a POST /borrowers request.
# Inherits all fields from BorrowerBase.
# -----------------------------------------------------------
class BorrowerCreate(BorrowerBase):
    """
    Schema for registering a new borrower.
    Inherits all fields from BorrowerBase.
    """
    pass  # All fields from BorrowerBase apply here


# -----------------------------------------------------------
# UPDATE SCHEMA
# Used when a client sends a PUT /borrowers/{id} request.
# All fields are optional so partial updates are supported.
# -----------------------------------------------------------
class BorrowerUpdate(BaseModel):
    """
    Schema for updating an existing borrower.
    All fields are optional to support partial (PATCH-style) updates.
    """
    borrower_name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated name of the borrower",
    )
    email: Optional[EmailStr] = Field(
        default=None,
        description="Updated email address",
    )
    phone: Optional[str] = Field(
        default=None,
        max_length=20,
        description="Updated phone number",
    )


# -----------------------------------------------------------
# RESPONSE SCHEMA
# Used when the API returns a borrower to the client.
# Includes the borrower_id assigned by the database.
# -----------------------------------------------------------
class BorrowerResponse(BorrowerBase):
    """
    Schema for returning a borrower record in API responses.
    Adds the database-generated borrower_id field.
    """
    borrower_id: int = Field(description="Auto-generated primary key")

    class Config:
        # from_attributes=True allows Pydantic to read data from
        # SQLAlchemy ORM model instances (not just plain dicts).
        from_attributes = True
