from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["db30"]
user_collection = db["tasks"]

# Pydantic model for validation

class TaskValidator(BaseModel):
    title: str = Field(..., min_length=1, max_length=50, description="First name is required")
    description: str = Field(..., min_length=1, max_length=50, description="Last name is required")
    status: bool = Field(..., description="Status is required")


async def validate_task(task_data: dict):
    """Validate user data and check email uniqueness."""
    try:
        # Validate using Pydantic
         TaskValidator(**task_data)

         return {"success": True}
    except ValidationError as e:
        return {"success": False, "error": e.errors()}



