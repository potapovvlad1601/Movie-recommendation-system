
const API_URL = "http://127.0.0.1:8000";

// Sync function
async function getErrorMessage(response, fallbackMessage) {
    try {
        const data = await response.json();

        if (typeof data.detail === "string") {
            return data.detail;
        }

        if (Array.isArray(data.detail)) {
            return data.detail
                .map((error) => error.msg)
                .filter(Boolean)
                .join(". ");
        }
    } catch {
        return fallbackMessage;
    }

    return fallbackMessage;
}

async function authenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("You must be logged in");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await getErrorMessage(
            response,
            "Request failed"
        );

        throw new Error(errorMessage);
    }

    // DELETE-запросы с кодом 204 не содержат тела ответа
    if (response.status === 204) {
        return null;
    }

    return await response.json();
}


// User Authentication
export async function loginUser(username, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = Array.isArray(data.detail)
            ? data.detail.map((error) => error.msg).join(", ")
            : data.detail || "Login failed";

        throw new Error(errorMessage);
    }

    return data;
}

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = Array.isArray(data.detail)
            ? data.detail.map((error) => error.msg).join(", ")
            : data.detail || "Registration failed";

        throw new Error(errorMessage);
    }

    return data;
}


// Movies fiches
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

export async function getMovies(page = 1) {
    const response = await fetch(
        `${API_URL}/api/movies?page=${page}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }

    return await response.json();
}

export async function getRecommendations(limit = 20) {
    return await authenticatedRequest(
        `/api/movies/recommendations?limit=${limit}`
    );
}

export async function getSimilarMovies(movieId, page = 1) {
    const response = await fetch(
        `${API_URL}/api/movies/${movieId}/similar?page=${page}`
    );

    if (!response.ok) {
        throw new Error("Failed to load similar movies");
    }

    return await response.json();
}

// Favorites
export async function getFavorites() {
    return await authenticatedRequest("/api/users/me/favorites");
}

export async function addToFavorites(movieId) {
    return await authenticatedRequest(
        `/api/users/me/favorites/${movieId}`,
        {
            method: "POST",
        }
    );
}

export async function removeFromFavorites(movieId) {
    return await authenticatedRequest(
        `/api/users/me/favorites/${movieId}`,
        {
            method: "DELETE",
        }
    );
}


// Watchlist
export async function getWatchlist() {
    return await authenticatedRequest("/api/users/me/watchlist");
}

export async function addToWatchlist(movieId) {
    return await authenticatedRequest(
        `/api/users/me/watchlist/${movieId}`,
        {
            method: "POST",
        }
    );
}

export async function removeFromWatchlist(movieId) {
    return await authenticatedRequest(
        `/api/users/me/watchlist/${movieId}`,
        {
            method: "DELETE",
        }
    );
}


// Ratings
export async function getRatings() {
    return await authenticatedRequest("/api/users/me/ratings");
}

export async function rateMovie(movieId, rating) {
    return await authenticatedRequest(
        `/api/users/me/ratings/${movieId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating }),
        }
    );
}

export async function removeRating(movieId) {
    return await authenticatedRequest(
        `/api/users/me/ratings/${movieId}`,
        {
            method: "DELETE",
        }
    );
}