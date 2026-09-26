import httpx

from app.core.config import settings


async def search_movies(query: str):
    url = f"{settings.tmdb_base_url}/search/movie"

    headers = {
        "Authorization": f"Bearer {settings.tmdb_api_token}",
        "accept": "application/json",
    }

    params = {
        "query": query,
        "language": "en-US",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers=headers,
            params=params,
        )

    response.raise_for_status()

    return response.json()