from pydantic import BaseModel, Field, condecimal,ValidationError
from datetime import datetime
from bson import ObjectId
from typing import Optional
from decimal import Decimal
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class TransactionValidator(BaseModel):
    amount: Optional[Decimal] = Field(ge=0.02,decimal_places=2,description="Amount must be > 0")
    date: datetime = Field(..., description="Transaction date is required")
    description: str = Field(..., min_length=1, max_length=100, description="Description is required")
    createdBy: PyObjectId = Field(..., description="Must be a valid MongoDB ObjectId")

async def validate_transaction(transaction_data: dict):
    """Validate transaction data"""
    try:
        TransactionValidator(**transaction_data)
        return {"success": True}
    except ValidationError as e:
        return {"success": False, "error": e.errors()}
