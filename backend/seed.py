import asyncio
from database import db

vehicles = [
    {
        "id": 1,
        "name": "Lightning Bolt",
        "color": "#00ff88",
        "unlocked": True,
        "price": 0,
        "type": "car",
        "image": "/placeholder.svg?height=120&width=200&text=🏎️",
        "stats": {"speed": 85, "acceleration": 90, "handling": 80},
        "description": "A balanced starter car with excellent acceleration.",
    },
    {
        "id": 2,
        "name": "Neon Racer",
        "color": "#ff0088",
        "unlocked": True,
        "price": 0,
        "type": "car",
        "image": "/placeholder.svg?height=120&width=200&text=🚗",
        "stats": {"speed": 80, "acceleration": 85, "handling": 90},
        "description": "Superior handling for tight network conditions.",
    },
    {
        "id": 3,
        "name": "Speed Demon",
        "color": "#0088ff",
        "unlocked": False,
        "price": 300,
        "type": "bike",
        "image": "/placeholder.svg?height=120&width=200&text=🏍️",
        "stats": {"speed": 95, "acceleration": 80, "handling": 70},
        "description": "Maximum speed bike for high-bandwidth connections.",
    },
    {
        "id": 4,
        "name": "Cyber Beast",
        "color": "#ff8800",
        "unlocked": False,
        "price": 500,
        "type": "car",
        "image": "/placeholder.svg?height=120&width=200&text=🚙",
        "stats": {"speed": 90, "acceleration": 85, "handling": 85},
        "description": "Well-rounded performance for all network types.",
    },
    {
        "id": 5,
        "name": "Thunder Bike",
        "color": "#8800ff",
        "unlocked": False,
        "price": 800,
        "type": "bike",
        "image": "/placeholder.svg?height=120&width=200&text=🏍️",
        "stats": {"speed": 100, "acceleration": 75, "handling": 65},
        "description": "Ultimate speed machine for fiber connections.",
    },
    {
        "id": 6,
        "name": "Quantum Drift",
        "color": "#ff4400",
        "unlocked": False,
        "price": 1000,
        "type": "car",
        "image": "/placeholder.svg?height=120&width=200&text=🏎️",
        "stats": {"speed": 88, "acceleration": 95, "handling": 92},
        "description": "Perfect balance of all performance metrics.",
    },
    {
        "id": 7,
        "name": "Plasma Storm",
        "color": "#4400ff",
        "unlocked": False,
        "price": 1500,
        "type": "car",
        "image": "/placeholder.svg?height=120&width=200&text=🚗",
        "stats": {"speed": 92, "acceleration": 88, "handling": 95},
        "description": "Exceptional handling for unstable connections.",
    },
    {
        "id": 8,
        "name": "Nitro Cycle",
        "color": "#ff0044",
        "unlocked": False,
        "price": 2000,
        "type": "bike",
        "image": "/placeholder.svg?height=120&width=200&text=🏍️",
        "stats": {"speed": 105, "acceleration": 70, "handling": 60},
        "description": "The fastest vehicle in the garage.",
    },
]


async def seed_vehicles():
    await db.vehicles.delete_many({})  # wipe garage clean, optional
    await db.vehicles.insert_many(vehicles)
    print("Garage seeded!")


if __name__ == "__main__":
    asyncio.run(seed_vehicles())
