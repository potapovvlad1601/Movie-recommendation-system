from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class RatingUpdate(BaseModel):
    rating: int = Field(ge=1, le=10)


class UserMovieResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    is_favorite: bool
    in_watchlist: bool
    rating: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserMovieListResponse(BaseModel):
    items: list[UserMovieResponse]
    total: int