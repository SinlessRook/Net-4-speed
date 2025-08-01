from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "You’ve opened your king’s flank. Welcome."}
