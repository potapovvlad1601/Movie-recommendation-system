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
    director: Optional[str] = None
    vote_average: float
    vote_count: int

class MovieBaseSchema(MovieSearchSchema):
    genres: list[Genre]


class MovieSearchResponse(BaseModel):
    page: int
    results: list[MovieSearchSchema]


class MovieBaseResponse(BaseModel):
    page: int
    results: list[MovieBaseSchema]


class MovieDetailExtendedSchema(MovieBaseSchema):
    overview: str
    backdrop_path: Optional[str] = None
    runtime: Optional[int] = None
    production_countries: list[ProductionCountry]
    homepage: Optional[str] = None


class CastMember(BaseModel):
    id: int
    name: str


class CrewMember(BaseModel):
    id: int
    name: str
    job: str


class MovieCreditsSchema(BaseModel):
    cast: list[CastMember]
    crew: list[CrewMember]
