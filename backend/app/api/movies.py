from fastapi import APIRouter, Query

from app.services.tmdb import search_movies

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"]
)


@router.get("/search")
async def search(
    query: str = Query(min_length=1)
):
    return await search_movies(query)