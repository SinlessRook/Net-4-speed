from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from full path
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

MONGO_URI = os.getenv("MONGO_URI")

MONGO_DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]
