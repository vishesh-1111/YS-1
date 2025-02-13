from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from bson import ObjectId
import os
from dotenv import load_dotenv
load_dotenv()
database_url = os.getenv("DATABASE_URL")

# MongoDB connection
client = AsyncIOMotorClient(database_url)
db = client["db30"]
user_collection = db["tasks"]

# Pydantic model for validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
class TaskValidator(BaseModel):
    title: str = Field(..., min_length=1, max_length=50, description="Title is required")
    description: str = Field(..., min_length=1, max_length=50, description="Description is required")
    status: bool = Field(..., description="Status is required")
    createdBy: PyObjectId = Field(..., description="Must be a valid MongoDB ObjectId")

async def validate_task(task_data: dict):
    """Validate user data"""
    try:
        # Validate using Pydantic
         TaskValidator(**task_data)

         return {"success": True}
    except ValidationError as e:
        return {"success": False, "error": e.errors()}



