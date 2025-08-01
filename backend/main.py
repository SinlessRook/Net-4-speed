"""
Main FastAPI application file.

This file sets up the FastAPI application, includes the routers from the `routers`
directory, and defines the WebSocket endpoint for the speed test.
"""

from fastapi import FastAPI, WebSocket
import asyncio
import random
import time


from .routers.garageRoutes import router as garage_router
from .routers.userRoutes import router as user_router
from .routers.leaderboardRoutes import router as leaderboard_router

app = FastAPI(
    title="Net-4-Speed API",
    description="API for the Net-4-Speed game.",
    version="0.1.0",
)


@app.websocket("/speedtest")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for the speed test.

    This endpoint simulates a download and upload speed test. The client can
    send "start_download" or "start_upload" to start the respective test.
    The server will then send back the speed in Mbps every 2 seconds.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data == "start_download":
                # Simulate sending data for 10 seconds to the client
                end_time = time.time() + 10
                while time.time() < end_time:
                    start_time = time.time()
                    # Generate a random chunk of data (e.g., 1MB to 20MB)
                    chunk_size = random.randint(1024 * 1024, 2 * 10000 * 1024)
                    chunk = "0" * chunk_size
                    await websocket.send_text(chunk)

                    # Wait for 2 seconds before sending the next chunk
                    await asyncio.sleep(2)

                    # Calculate and send download speed
                    elapsed = time.time() - start_time
                    speed_mbps = (len(chunk) * 8) / (elapsed * 1024 * 1024)
                    await websocket.send_json(
                        {"type": "download_speed", "speed": round(speed_mbps, 2)}
                    )

            elif data == "start_upload":
                # Simulate receiving data for 10 seconds from the client
                end_time = time.time() + 10
                while time.time() < end_time:
                    start_time = time.time()

                    # Instruct the client to send a data chunk
                    await websocket.send_text("send_chunk")

                    # Receive the data chunk from the client
                    chunk = await websocket.receive_text()

                    # Wait for 2 seconds plus a small random delay to simulate network latency
                    await asyncio.sleep(2 + random.uniform(0, 0.5))

                    # Calculate and send upload speed
                    elapsed = time.time() - start_time
                    speed_mbps = (len(chunk) * 8) / (elapsed * 1024 * 1024)
                    await websocket.send_json(
                        {"type": "upload_speed", "speed": round(speed_mbps, 2)}
                    )
    except Exception:
        # Close the WebSocket connection if an error occurs
        await websocket.close()


# Include routers for different API functionalities
app.include_router(garage_router, prefix="/garage", tags=["garage"])
app.include_router(user_router, prefix="/auth", tags=["auth"])
