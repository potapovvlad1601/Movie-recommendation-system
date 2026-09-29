
const API_URL = "http://127.0.0.1:8000";

export async function getMovies(page = 1) {
    const response = await fetch(
        `${API_URL}/api/movies?page=${page}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }

    return await response.json();
}

export async function getMovieById(movieId) {
    const response = await fetch(
        `${API_URL}/api/movies/${movieId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }

    return await response.json();
}

export async function searchMovies(query) {
    const response = await fetch(
        `${API_URL}/api/movies/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to search movies");
    }

    return await response.json();
}