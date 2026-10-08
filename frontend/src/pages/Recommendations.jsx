import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getRecommendations } from "../services/api";

function Recommendations() {
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["recommendations", 20],
        queryFn: () => getRecommendations(20),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const movies = Array.isArray(data)
        ? data
        : data?.items ?? data?.results ?? [];

    return (
        <section className="movies-section">
            <div className="section-header">
                <h2>Recommendations</h2>
            </div>

            {isLoading && (
                <p className="status-message">Loading recommendations...</p>
            )}

            {!isLoading && isError && (
                <p className="status-message error">
                    {error?.message || "Failed to load recommendations."}
                </p>
            )}

            {!isLoading && !isError && movies.length === 0 && (
                <p className="status-message">
                    Rate some movies or add them to your favorites to get recommendations.
                </p>
            )}

            {!isLoading && !isError && movies.length > 0 && (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div
                            className="movie-card"
                            key={movie.id}
                            onClick={() => navigate(`/movies/${movie.id}`)}
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
    );
}

export default Recommendations;