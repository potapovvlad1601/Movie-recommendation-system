from fastapi import FastAPI

app = FastAPI(
    title="Movie Recommendation System",
    description="Backend API for a movie recommendation system",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {
        "message": "Movie Recommendation System API",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok"
    }