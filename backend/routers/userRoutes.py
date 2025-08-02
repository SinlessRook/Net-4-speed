"""
Router for the user authentication endpoints.

This router handles the following endpoints:
- /signup: Register a new user.
- /signin: Log in a user.
- /refresh: Refresh the access token.
- /me: Get the current user's information.
- /exists/{username}: Check if a username exists.
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from ..database import db

router = APIRouter()
"""API Router for user authentication and management."""

# Configuration for JWT and security
SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")


# Schemas
class UserIn(BaseModel):
    """Pydantic model for user input."""

    username: str
    password: str
    email: str | None = None  # Optional email field


class UserOut(BaseModel):
    """Pydantic model for user output."""

    username: str


class Token(BaseModel):
    """Pydantic model for the authentication token."""

    access_token: str
    token_type: str
    refresh_token: str


# Helpers
def hash_password(password):
    """Hashes a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    """Verifies a password against a hash."""
    return pwd_context.verify(plain, hashed)


def create_token(data: dict, expires_delta: timedelta):
    """Creates a JWT token."""
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(username: str):
    """Creates an access token."""
    return create_token(
        {"sub": username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )


def create_refresh_token(username: str):
    """Creates a refresh token."""
    return create_token({"sub": username}, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Gets the current user from the authentication token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user


# Auth Endpoints
@router.post("/signup", response_model=Token)
async def signup(user: UserIn):
    """Registers a new user."""
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed = hash_password(user.password)
    await db.users.insert_one(
        {
            "username": user.username,
            "hashed_password": hashed,
            "points": 0,
            "unlocked_vehicles": [],
        }
    )
    return {
        "access_token": create_access_token(user.username),
        "token_type": "bearer",
        "refresh_token": create_refresh_token(user.username),
    }


@router.post("/signin", response_model=Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    """Logs in a user."""
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access_token": create_access_token(user["username"]),
        "token_type": "bearer",
        "refresh_token": create_refresh_token(user["username"]),
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    """Refreshes the access token."""
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return {
        "access_token": create_access_token(username),
        "token_type": "bearer",
        "refresh_token": create_refresh_token(username),
    }


@router.get("/me", response_model=UserOut)
async def get_me(user=Depends(get_current_user)):
    """Gets the current user's information."""
    return {"username": user["username"]}


@router.get("/exists/{username}")
async def check_username(username: str):
    """Checks if a username exists."""
    user = await db.users.find_one({"username": username})
    return {"exists": user is not None}
