"""
Database configuration for the FastAPI application.

This module handles the connection to the MongoDB database using Motor (asyncio driver).
It loads environment variables for the MongoDB URI and database name.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from the .env file located in the same directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

# Retrieve MongoDB URI and database name from environment variables
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("DB_NAME")

# Initialize the MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Select the database
db = client[MONGO_DB_NAME]
