from fastapi import FastAPI, HTTPException,Request 
from jose import JWTError, jwt
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

app = FastAPI()


