from collections import Counter

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.user_movie import UserMovie

from app.services.tmdb import (
    get_movie,
    get_movies,
    search_movies,
    get_movie_recommendations,
)

from app.schemas.movie import (
    MovieDetailExtendedSchema,
    MovieListResponse,
    MovieSearchResponse,
)

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"]
)


@router.get("", response_model=MovieListResponse)
async def get_movies_list(page: int = Query(default=1, ge=1)):
    return await get_movies(page)


@router.get("/search", response_model=MovieSearchResponse)
async def search(query: str = Query(min_length=1)):
    return await search_movies(query)

@router.get("/recommendations")
async def get_recommendations(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movies = (
        db.query(UserMovie)
        .filter(
            UserMovie.user_id == current_user.id,
            (
                (UserMovie.is_favorite.is_(True))
                | (UserMovie.rating > 7)
            ),
        )
        .all()
    )

    if not user_movies:
        return {
            "items": [],
            "total": 0,
        }

    # Получаем уникальные movie_id.
    movie_ids = {
        user_movie.movie_id
        for user_movie in user_movies
    }

    # Фильмы, с которыми пользователь уже взаимодействовал.
    interacted_movie_ids = {
        user_movie.movie_id
        for user_movie in db.query(UserMovie)
        .filter(UserMovie.user_id == current_user.id)
        .all()
    }

    all_recommendations = []

    for movie_id in movie_ids:
        recommendations = await get_movie_recommendations(movie_id)

        all_recommendations.extend(
            recommendations.get("results", [])
        )

    # Считаем, сколько раз каждый фильм встретился
    # среди рекомендаций разных фильмов пользователя.
    recommendation_counts = Counter(
        movie["id"]
        for movie in all_recommendations
    )

    # Сохраняем сам объект фильма для каждого movie_id.
    movies_by_id = {}

    for movie in all_recommendations:
        movie_id = movie["id"]

        if movie_id not in movies_by_id:
            movies_by_id[movie_id] = movie

    # Убираем фильмы, с которыми пользователь уже взаимодействовал.
    movies_by_id = {
        movie_id: movie
        for movie_id, movie in movies_by_id.items()
        if movie_id not in interacted_movie_ids
    }

    # Добавляем количество совпадений.
    result = []

    for movie_id, movie in movies_by_id.items():
        movie_data = movie.copy()
        movie_data["recommendation_count"] = recommendation_counts[movie_id]

        result.append(movie_data)

    # Сначала фильмы, которые встретились чаще всего.
    # При одинаковом количестве можно дополнительно
    # ориентироваться на рейтинг TMDB.
    result.sort(
        key=lambda movie: (
            recommendation_counts[movie["id"]],
            movie.get("vote_average", 0),
        ),
        reverse=True,
    )

    result = result[:limit]

    return {
        "items": result,
        "total": len(result),
    }


@router.get(
    "/{movie_id}/recommendations"
)
async def get_movie_recommendations_endpoint(
    movie_id: int,
):
    return await get_movie_recommendations(movie_id)


@router.get("/{movie_id}", response_model=MovieDetailExtendedSchema)
async def get_movie_details(movie_id: int):
    return await get_movie(movie_id)

