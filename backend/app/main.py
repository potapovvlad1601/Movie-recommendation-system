from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import engine, get_db
from app.core.security import hash_password

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse


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


@app.get("/api/health/db")
async def database_health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {
        "database": "connected",
        "result": result.scalar()
    }

@app.post("/api/users", response_model=UserResponse)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

# Найти все процессы tasklist | findstr python
# Найти netstat -ano | findstr :8000

# Запуск в консоли python -m uvicorn app.main:app --reload

# Убить все процессы taskkill /F /IM python.exe
# Убить процес taskkill /PID 19004 /F