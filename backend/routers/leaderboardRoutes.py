from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from ..database import db
from .userRoutes import get_current_user  

router = APIRouter()

# Schema
class LeaderboardEntry(BaseModel):
    id: str
    username: str
    points: int
    wins: int
    losses: int
    avatar: str
    isp: str

class ScoreUpdate(BaseModel):
    points: int
    wins: int
    losses: int

# GET Endpoint - view the leaderboard
@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard():
    leaderboard = []
    async for entry in db.leaderboard.find():
        if "_id" in entry:
            entry["id"] = str(entry["_id"])
            del entry["_id"]
        leaderboard.append(entry)

    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return leaderboard

@router.get("/leaderboard/me", response_model=LeaderboardEntry)
async def get_my_score(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    entry = await db.leaderboard.find_one({"username": username})
    if not entry:
        raise HTTPException(status_code=404, detail="Leaderboard entry not found")
    entry["id"] = str(entry["_id"])
    entry.pop("_id", None)
    return entry

# POST Endpoint - update or insert score
@router.post("/leaderboard/update", response_model=LeaderboardEntry)
async def update_score(
    update: ScoreUpdate,
    current_user: dict = Depends(get_current_user)
):
    username = current_user["username"]

    existing = await db.leaderboard.find_one({"username": username})

    if existing:
        # A brutal endgame—update stats
        existing["points"] = update.points
        existing["wins"] = update.wins
        existing["losses"] = update.losses
        await db.leaderboard.update_one(
            {"username": username},
            {"$set": existing}
        )
    else:
        # A surprise knight fork—insert new challenger
        new_entry = {
            "username": username,
            "points": update.points,
            "wins": update.wins,
            "losses": update.losses,
            "avatar": f"/avatars/{username}.png",
            "isp": "Unknown"
        }
        await db.leaderboard.insert_one(new_entry)
        existing = new_entry

    # Return updated piece
    existing["id"] = str(existing.get("_id", "new"))
    existing.pop("_id", None)
    return existing
