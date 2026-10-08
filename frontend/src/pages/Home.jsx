
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovies, searchMovies } from "../services/api";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

    const trimmedQuery = searchQuery.trim();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["movies", { mode: isSearching ? "search" : "popular", q: trimmedQuery }],
        queryFn: async () => {
            if (isSearching && trimmedQuery) {
                const res = await searchMovies(trimmedQuery);
                return Array.isArray(res) ? { results: res } : { results: res?.results ?? [] };
            } else {
                const res = await getMovies(1);
                return Array.isArray(res) ? { results: res } : { results: res?.results ?? [] };
            }
        },
        enabled: isSearching ? Boolean(trimmedQuery) : true,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        // сохраняем предыдущие данные при переключении между популярными/поиском
        placeholderData: (prev) => prev,
    });

    const movies = data?.results ?? [];

    async function handleSearch(event) {
        event.preventDefault();
        if (!trimmedQuery) {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
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
                            disabled={isLoading}
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

                {isLoading && (
                    <p className="status-message">
                        {isSearching
                            ? "Searching movies..."
                            : "Loading movies..."}
                    </p>
                )}

                {isError && (
                    <p className="status-message error">
                        {error?.message || (isSearching ? "Failed to search movies" : "Failed to load movies")}
                    </p>
                )}

                {!isLoading && !isError && movies.length === 0 && (
                    <p className="status-message">
                        {isSearching
                            ? "No movies found."
                            : "No movies available."}
                    </p>
                )}

                {!isLoading && !isError && movies.length > 0 && (
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