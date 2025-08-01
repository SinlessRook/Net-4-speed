from fastapi import FastAPI
from routers.speedtest import router as speedtest_router

app = FastAPI()
app.include_router(speedtest_router)

@app.get("/health")
def health_check():
    # Simulate occasional network issues for testing
    should_fail = False  # 5% chance of failure for testing
    if should_fail:
        return {"status": "error", "message": "Network unavailable"}, 503
    return {"status": "ok", "message": "Network is healthy"}
