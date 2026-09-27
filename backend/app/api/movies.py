from fastapi import APIRouter, Query

from app.services.tmdb import get_movie, get_movies, search_movies
from app.schemas.movie import (
    MovieDetailExtendedSchema,
    MovieBaseResponse,
    MovieSearchResponse,
)

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"]
)


@router.get("", response_model=MovieBaseResponse)
async def get_movies_list(page: int = Query(default=1, ge=1)):
    return await get_movies(page)


@router.get("/search", response_model=MovieSearchResponse)
async def search(query: str = Query(min_length=1)):
    return await search_movies(query)


@router.get("/{movie_id}", response_model=MovieDetailExtendedSchema)
async def get_movie_details(movie_id: int):
    return await get_movie(movie_id)
