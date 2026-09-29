
const API_URL = "http://127.0.0.1:8000";

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

export async function getMovies(page = 1) {
    const response = await fetch(
        `${API_URL}/api/movies?page=${page}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }

    return await response.json();
}

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
