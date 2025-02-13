from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
database_url = os.getenv("DATABASE_URL")
# MongoDB connection
client = AsyncIOMotorClient(database_url)
db = client["db30"]
user_collection = db["users"]

# Pydantic model for validation
class UserValidator(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50, description="First name is required")
    last_name: str = Field(..., min_length=1, max_length=50, description="Last name is required")
    email: EmailStr
    hash: str = Field(..., min_length=5, max_length=128, description="Hash is required")
    salt: str = Field(..., min_length=5, max_length=128, description="Salt is required")

async def is_unique_email(email: str) -> bool:
    """Check if email is unique in the MongoDB collection."""
    existing_user = await user_collection.find_one({"email": email})
    return existing_user is None

async def validate_user(user_data: dict):
    """Validate user data and check email uniqueness."""
    try:
        # Validate using Pydantic
        user = UserValidator(**user_data)

        # Check if email is unique
        if not await is_unique_email(user.email):
            return {"success": False, "error": "Email already exists"}

        return {"success": True, "data": user.model_dump()}
    except ValidationError as e:
        return {"success": False, "error": e.errors()}


# Example usage
# async def main():
#     new_user = {
#         "first_name": "John",
#         "last_name": "Doe",
#         "email": "v@gmail.com",
#         "hash": "some_secure_hash",
#         "salt": "some_secure_salt"
#     }

#     result = await validate_user(new_user)
#     print(result)

# # If running in an async environment
# asyncio.run(main())
