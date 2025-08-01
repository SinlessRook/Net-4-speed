from fastapi import FastAPI
from routers.speedtest import router as speedtest_router
from .routers.garageRoutes import router as garage_router
from .routers.userRoutes import router as user_router

app = FastAPI()
app.include_router(speedtest_router)

@app.get("/health")
def health_check():
    # Simulate occasional network issues for testing
    should_fail = False  # 5% chance of failure for testing
    if should_fail:
        return {"status": "error", "message": "Network unavailable"}, 503
    return {"status": "ok", "message": "Network is healthy"}


app = FastAPI()
app.include_router(garage_router, prefix="/garage", tags=["garage"])
app.include_router(user_router, prefix="/auth", tags=["auth"])