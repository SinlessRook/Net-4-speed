import asyncio
import websockets
import time


async def test_upload():
    uri = "ws://localhost:8000/speedtest"
    async with websockets.connect(uri) as websocket:
        await websocket.send("start_upload")

        while True:
            try:
                message = await websocket.recv()
                if message == "send_chunk":
                    # Send a 10MB chunk of data
                    chunk = "0" * (10 * 1024 * 1024)
                    await websocket.send(chunk)
                else:
                    print(f"Received: {message}")
            except websockets.exceptions.ConnectionClosed:
                print("Connection closed")
                break


if __name__ == "__main__":
    asyncio.run(test_upload())
