from fastapi import FastAPI, HTTPException,Response,Request
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from db.taskSchema import TransactionValidator
from pymongo.errors import PyMongoError
from bson import ObjectId
import os
from datetime import datetime
from jose import JWTError, jwt
from dotenv import load_dotenv
load_dotenv()
# # FastAPI app setup
app = FastAPI()
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
origins = [
    os.getenv("VERCEL_ORIGIN") ,
    'http://localhost:3000'
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST","GET","PUT","DELETE","HEAD", "OPTIONS"],
    allow_headers=["Access-Control-Allow-Headers",
                    'Content-Type', 'Authorization',
                      'Access-Control-Allow-Origin',
                      "X-Requested-With", 
                      ],
)
database_url = os.getenv("DATABASE_URL")

client = AsyncIOMotorClient(database_url);  
db = client["db31"]
transaction_collection = db["transactions"]

# print(database_url)

class TransactionPostRequest(BaseModel):
    amount : float
    description : str 
    date : datetime
    category :str

class TransactionPutRequest(BaseModel):
    amount : float
    description : str 
    date :str
    category : str

@app.post("/transactions")
async def login(request: Request,transaction_data: TransactionPostRequest,response: Response):
    print(transaction_data)

    try:
        result = await transaction_collection.insert_one({
            "amount": transaction_data.amount,
            "description": transaction_data.description,
             "date" : transaction_data.date,
             "category":transaction_data.category
        })
        return {"message": "Transaction created successfully", "transaction_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create transaction: {str(e)}")
def task_serializer(transaction):
    """Convert MongoDB transaction document to a JSON-serializable format."""
    return {
        "_id": str(transaction["_id"]),
        "amount": transaction["amount"],
        "description": transaction["description"],
        "date": transaction["date"],
        "category":transaction["category"]
    }
@app.get("/transactions")
async def get_transactions(request: Request):
    transactions =  await transaction_collection.find().to_list(length=100)
    serialized_transactions = [task_serializer(transaction) for transaction in transactions]
    return {"transactions": serialized_transactions}


@app.put("/transactions/{transaction_id}")
async def update_transactions(transaction_id: str, transaction_data: TransactionPutRequest, request: Request):


    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

    transaction = await transaction_collection.find_one({"_id": ObjectId(transaction_id)})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found or not authorized to update")

    await transaction_collection.update_one(
        {"_id": ObjectId(transaction_id)},
        {"$set": {"amount": transaction_data.amount, 
                  "description": transaction_data.description,
                    "date":transaction_data.date,
                    "category":transaction_data.category
                    }}
    )
    return {"message": "Transaction updated successfully"}


@app.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, request: Request):

    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(date_code=400, detail="Invalid transaction ID")

    transaction = await transaction_collection.find_one({"_id": ObjectId(transaction_id)})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found or not authorized to delete")

    await transaction_collection.delete_one({"_id": ObjectId(transaction_id)})
    return {"message": "Transaction deleted successfully"}
    
    


@app.get("/")
async def read_root(request:Request):
    return {"message": "Hello User"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
