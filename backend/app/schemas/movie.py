from typing import Optional

from pydantic import BaseModel


class Genre(BaseModel):
    id: int
    name: str


class ProductionCountry(BaseModel):
    iso_3166_1: str
    name: str


class MovieSearchSchema(BaseModel):
    id: int
    title: str
    poster_path: Optional[str] = None
    release_date: str
    vote_average: float
    vote_count: int


class MovieListSchema(MovieSearchSchema):
    pass


class MovieBaseSchema(MovieSearchSchema):
    director: Optional[str] = None
    genres: list[Genre]


class MovieSearchResponse(BaseModel):
    page: int
    results: list[MovieSearchSchema]


class MovieListResponse(BaseModel):
    page: int
    results: list[MovieListSchema]


class CastMember(BaseModel):
    id: int
    name: str
    character: Optional[str] = None


class CrewMember(BaseModel):
    id: int
    name: str
    job: str


class MovieCreditsSchema(BaseModel):
    cast: list[CastMember]
    crew: list[CrewMember]

class MovieDetailExtendedSchema(MovieBaseSchema):
    overview: str
    backdrop_path: Optional[str] = None
    runtime: Optional[int] = None
    production_countries: list[ProductionCountry]
    homepage: Optional[str] = None
    credits: MovieCreditsSchema