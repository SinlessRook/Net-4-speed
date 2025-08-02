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

leaderboard = [
    { "id": "1", "username": "SpeedDemon", "points": 2450, "wins": 45, "losses": 12, "avatar": "🏎️", "isp": "Fiber Pro" },
    { "id": "2", "username": "TurboNet", "points": 2380, "wins": 42, "losses": 15, "avatar": "🚗", "isp": "Ultra ISP" },
    { "id": "3", "username": "RaceKing", "points": 2200, "wins": 38, "losses": 18, "avatar": "🏁", "isp": "Lightning Web" },
    { "id": "4", "username": "NetNinja", "points": 2100, "wins": 35, "losses": 20, "avatar": "⚡", "isp": "Speed Force" },
    { "id": "5", "username": "CyberRacer", "points": 1950, "wins": 32, "losses": 23, "avatar": "🎮", "isp": "Quantum Net" },
    { "id": "6", "username": "VelocityViper", "points": 1850, "wins": 28, "losses": 25, "avatar": "🐍", "isp": "Hyper Link" },
    { "id": "7", "username": "NitroNomad", "points": 1750, "wins": 25, "losses": 28, "avatar": "🔥", "isp": "Blaze ISP" },
    { "id": "8", "username": "PixelPilot", "points": 1650, "wins": 22, "losses": 30, "avatar": "🚀", "isp": "Rocket Net" },
]

async def seed_vehicles():
    await db.vehicles.delete_many({})
    await db.vehicles.insert_many(vehicles)
    print("🚗 Vehicles seeded.")

async def seed_leaderboard():
    await db.leaderboard.delete_many({})
    await db.leaderboard.insert_many(leaderboard)
    print("🏁 Leaderboard seeded.")

async def seed_all():
    await seed_vehicles()
    await seed_leaderboard()

if __name__ == "__main__":
    asyncio.run(seed_all())
