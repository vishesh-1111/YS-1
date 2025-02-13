from fastapi import FastAPI, HTTPException,Response,Request
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from utils.token import create_access_token
import bcrypt
from db.userSchema import validate_user
from db.taskSchema import validate_task
from pymongo.errors import PyMongoError
from bson import ObjectId
import os

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
    allow_methods=["POST","GET","PUT","DELETE"],
    allow_headers=["Access-Control-Allow-Headers",
                    'Content-Type', 'Authorization',
                      'Access-Control-Allow-Origin',
                      "X-Requested-With", 
                      ],
)
@app.middleware("http")
async def jwt_middleware(request: Request, call_next):

    token = request.cookies.get("token") or request.headers.get("authorization")
   
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload  # Attach user information to request state
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    else:
        request.state.user = None  # No token found

    print('middleware',request.state.user); 
    response = await call_next(request)
    return response
database_url = os.getenv("DATABASE_URL")
print(database_url)

client = AsyncIOMotorClient()  
db = client["db30"]
user_collection = db["users"]
task_collection = db["tasks"]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class TaskPostRequest(BaseModel):
    title : str
    description : str 

class TaskPutRequest(BaseModel):
    title : str
    description : str 
    status :str    


async def get_user_by_email(email: str):
    """Fetch user by email from the database."""
    return await user_collection.find_one({"email": email})



@app.post("/register")
async def signup(request: SignupRequest):
  
    """Signup route to create a new user."""

    # Check if the email already exists in the database
    existing_user = await user_collection.find_one({"email": request.email})
    if existing_user:
        # if email already exists, raise HTTP 400 error
        raise HTTPException(status_code=400, detail="Email already registered")

    
    salt = bcrypt.gensalt()  
    hash = bcrypt.hashpw(request.password.encode("utf-8"), salt).decode("utf-8")

    user_data = {
        "first_name": request.first_name,
        "last_name": request.last_name,
        "email": request.email,
        "hash": hash,
        "salt": salt,
    }
    
    validationResponse = await validate_user(user_data)

    if validationResponse['success']:
        user = await user_collection.insert_one(user_data)
     
        return {
            "message": validationResponse["success"],
            "user": {
                "id" : str(user.inserted_id), 
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "email": user_data["email"]
            },
            "validationResponse": validationResponse
        }
    else:
        raise HTTPException(status_code=400, detail=validationResponse['error'])



@app.post("/login")
async def login(request: Request,login_data: LoginRequest,response: Response):
  
    user = await get_user_by_email(login_data.email)
    user_data = {
     "_id" :str(user.get('_id')),
    'first_name': user.get('first_name'),
    'last_name':  user.get('last_name'),
    'email':      user.get('email'),
    'hash':       user.get('hash'),
}  

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    


    if not bcrypt.checkpw(login_data.password.encode("utf-8"), user["hash"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user_data)
    print(access_token)
    
    response.set_cookie(
            key="token", 
            value=access_token, 
            httponly=True,  
            max_age=3600,   
            expires=3600,   
            samesite="none",
            secure=True,
        )
    
    return {"message": "Login successful", "user": {
        "first_name": user["first_name"],
         "last_name": user["last_name"],
         "email" : login_data.email,
         "token" :access_token,
          }}



@app.post("/tasks")
async def login(request: Request,task_data: TaskPostRequest,response: Response):
    user=request.state.user
    print(task_data)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # validate_task(task_data)
    
    try:
        result = await task_collection.insert_one({
            "title": task_data.title,
            "description": task_data.description,
            "createdBy":user["_id"],  
            "status": "todo"
        })
        return {"message": "Task created successfully", "task_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")
def task_serializer(task):
    """Convert MongoDB task document to a JSON-serializable format."""
    return {
        "_id": str(task["_id"]),
        "title": task["title"],
        "description": task["description"],
        "createdBy": str(task["createdBy"]),
        "status": task["status"]
    }
@app.get("/tasks")
async def get_tasks(request: Request):
    user = request.state.user
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    tasks =  await task_collection.find({"createdBy":user["_id"]}).to_list(length=100)
    serialized_tasks = [task_serializer(task) for task in tasks]
    return {"tasks": serialized_tasks}


@app.put("/tasks/{task_id}")
async def update_task(task_id: str, task_data: TaskPutRequest, request: Request):
    user = request.state.user
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID")

    task = await task_collection.find_one({"_id": ObjectId(task_id), "createdBy": user["_id"]})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not authorized to update")

    await task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"title": task_data.title, 
                  "description": task_data.description,
                  "status":task_data.status}}
    )
    return {"message": "Task updated successfully"}


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str, request: Request):
    user = request.state.user
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID")

    task = await task_collection.find_one({"_id": ObjectId(task_id), "createdBy": user["_id"]})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not authorized to delete")

    await task_collection.delete_one({"_id": ObjectId(task_id)})
    return {"message": "Task deleted successfully"}
    
    


@app.get("/")
async def read_root(request:Request):
    user1=(request.state.user)
    print(user1.get('first_name'));
    print(user1['first_name']);
    # name = user1.first_name
    # print(name)
    return {"message": "Hello " + user1['first_name']+' ' + user1['last_name']}

@app.get("/logout")
async def logout(request: Request,response: Response):
    response.delete_cookie(key="token")  
    return {"message": "Logout successful"}
