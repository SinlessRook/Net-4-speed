"""
Router for the garage endpoints.

This router handles the following endpoints:
- /getall: Get all vehicles in the garage.
- /unlock/{vehicle_id}: Unlock a vehicle.
"""

from fastapi import APIRouter, HTTPException, Depends
from ..database import db
from pydantic import BaseModel
from typing import Literal
from .userRoutes import get_current_user


class Stats(BaseModel):
    """Pydantic model for vehicle stats."""

    speed: int
    acceleration: int
    handling: int


class Vehicle(BaseModel):
    """Pydantic model for a vehicle."""

    id: int
    name: str
    color: str
    unlocked: bool
    price: int
    type: Literal["car", "bike"]
    image: str
    stats: Stats
    description: str


router = APIRouter()


@router.get("/getall", response_model=list[Vehicle])
async def get_garage(user=Depends(get_current_user)):
    """
    Get all vehicles in the garage.

    This endpoint returns a list of all vehicles in the garage. The `unlocked`
    field is set to `True` if the user has unlocked the vehicle.
    """
    vehicles = []
    unlocked = user.get("unlocked_vehicles", [])
    async for vehicle in db.vehicles.find():
        vehicle["_id"] = str(vehicle["_id"])
        vehicle["unlocked"] = vehicle["id"] in unlocked
        vehicles.append(vehicle)
    return vehicles


@router.post("/unlock/{vehicle_id}")
async def unlock_vehicle(vehicle_id: int, user=Depends(get_current_user)):
    """
    Unlock a vehicle.

    This endpoint unlocks a vehicle for the user if they have enough points.
    """
    vehicle = await db.vehicles.find_one({"id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if vehicle_id in user.get("unlocked_vehicles", []):
        return {"message": "Already unlocked!"}

    user_points = user.get("points", 0)
    if user_points < vehicle["price"]:
        raise HTTPException(
            status_code=400, detail="Not enough points to unlock this ride."
        )

    # Update user: deduct points and unlock vehicle
    await db.users.update_one(
        {"username": user["username"]},
        {
            "$inc": {"points": -vehicle["price"]},
            "$push": {"unlocked_vehicles": vehicle_id},
        },
    )

    return {"message": f"🚗 Vehicle {vehicle['name']} unlocked successfully!"}
