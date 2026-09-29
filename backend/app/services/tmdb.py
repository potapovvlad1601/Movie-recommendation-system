
import httpx

from app.core.config import settings


def get_tmdb_headers():
    return {
        "Authorization": f"Bearer {settings.tmdb_api_token}",
        "accept": "application/json",
    }


async def search_movies(query: str):
    url = f"{settings.tmdb_base_url}/search/movie"

    params = {
        "query": query,
        "language": "en-US",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers=get_tmdb_headers(),
            params=params,
        )

    response.raise_for_status()

    return response.json()


async def get_movies(page: int = 1):
    url = f"{settings.tmdb_base_url}/movie/popular"

    params = {
        "language": "en-US",
        "page": page,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers=get_tmdb_headers(),
            params=params,
        )

    response.raise_for_status()

    movies_data = response.json()

    return {
        "page": movies_data["page"],
        "results": movies_data.get("results", []),
    }


async def get_movie(movie_id: int):
    url = f"{settings.tmdb_base_url}/movie/{movie_id}"

    params = {
        "language": "en-US",
        "append_to_response": "credits",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers=get_tmdb_headers(),
            params=params,
        )

    response.raise_for_status()

    movie_data = response.json()

    director = next(
        (
            crew_member.get("name")
            for crew_member in movie_data.get("credits", {}).get("crew", [])
            if crew_member.get("job") == "Director"
        ),
        None,
    )

    movie_data["director"] = director

    return movie_data
