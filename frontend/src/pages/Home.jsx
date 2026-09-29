
import { useEffect, useState } from "react";
import { getMovies, searchMovies } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const navigate = useNavigate();

    // Загрузка популярных фильмов
    async function loadPopularMovies() {
        try {
            setLoading(true);
            setError(null);
            setSearchError(null);

            const data = await getMovies(1);

            setMovies(data.results);
            setIsSearching(false);
        } catch (error) {
            console.error(error);
            setError("Failed to load movies");
        } finally {
            setLoading(false);
        }
    }

    // Первоначальная загрузка при открытии страницы
    useEffect(() => {
        loadPopularMovies();
    }, []);

    // Обработка поискового запроса
    async function handleSearch(event) {
        event.preventDefault();

        const query = searchQuery.trim();

        // Если строка пустая, возвращаем популярные фильмы
        if (!query) {
            await loadPopularMovies();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSearchError(null);
            setIsSearching(true);

            const data = await searchMovies(query);

            setMovies(data.results);
        } catch (error) {
            console.error(error);
            setSearchError("Failed to search movies");
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="home">
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-label">
                        MOVIE RECOMMENDATION SYSTEM
                    </p>

                    <h1>
                        Find your next
                        <span> favorite movie</span>
                    </h1>

                    <p className="hero-description">
                        Discover movies you'll love based on your
                        preferences and viewing history.
                    </p>

                    <form
                        className="search-container"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for movies..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="search-button"
                            disabled={loading}
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="movies-section">
                <div className="section-header">
                    <h2>
                        {isSearching ? "Search Results" : "Popular Movies"}
                    </h2>

                    {!isSearching && (
                        <button className="view-all-button">
                            View all →
                        </button>
                    )}
                </div>

                {loading && (
                    <p className="status-message">
                        {isSearching
                            ? "Searching movies..."
                            : "Loading movies..."}
                    </p>
                )}

                {error && (
                    <p className="status-message error">
                        {error}
                    </p>
                )}

                {searchError && (
                    <p className="status-message error">
                        {searchError}
                    </p>
                )}

                {!loading && !error && !searchError && movies.length === 0 && (
                    <p className="status-message">
                        {isSearching
                            ? "No movies found."
                            : "No movies available."}
                    </p>
                )}

                {!loading && !error && !searchError && movies.length > 0 && (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <div
                                className="movie-card"
                                key={movie.id}
                                onClick={() =>
                                    navigate(`/movies/${movie.id}`)
                                }
                            >
                                <div className="movie-poster">
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    ) : (
                                        <span>🎬</span>
                                    )}
                                </div>

                                <div className="movie-info">
                                    <h3>{movie.title}</h3>
                                    <div className="movie-meta">
                                        <p>
                                            {movie.release_date
                                                ? movie.release_date.substring(0, 4)
                                                : "Unknown"}
                                        </p>

                                        <div className="movie-rating">
                                            ★ {movie.vote_average.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;