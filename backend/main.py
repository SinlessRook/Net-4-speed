from fastapi import FastAPI, WebSocket
import time
import asyncio
import random

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data == "start_download":
                # Simulate sending data for 10 seconds
                end_time = time.time() + 10
                while time.time() < end_time:
                    start_time = time.time()
                    # Send a random chunk of data (e.g., 0.5MB to 2MB)
                    chunk_size = random.randint(1024 * 1024, 2 * 10000 * 1024)
                    chunk = "0" * chunk_size
                    await websocket.send_text(chunk)
                    
                    # Wait for 2 seconds
                    await asyncio.sleep(2)
                    
                    # Calculate speed
                    elapsed = time.time() - start_time
                    speed_mbps = (len(chunk) * 8) / (elapsed * 1024 * 1024)
                    await websocket.send_json({"type": "download_speed", "speed": round(speed_mbps, 2)})

            elif data == "start_upload":
                # Simulate receiving data for 10 seconds
                end_time = time.time() + 10
                while time.time() < end_time:
                    start_time = time.time()
                    
                    # Tell the client to start sending data
                    await websocket.send_text("send_chunk")
                    
                    # Receive data from the client
                    chunk = await websocket.receive_text()
                    
                    # Wait for 2 seconds plus a small random delay
                    await asyncio.sleep(2 + random.uniform(0, 0.5))
                    
                    # Calculate speed
                    elapsed = time.time() - start_time
                    speed_mbps = (len(chunk) * 8) / (elapsed * 1024 * 1024)
                    await websocket.send_json({"type": "upload_speed", "speed": round(speed_mbps, 2)})
    except Exception:
        await websocket.close()

