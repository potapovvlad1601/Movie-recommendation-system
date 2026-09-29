import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getMovieById } from "../services/api";

function MovieDetails() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMovie() {
            try {
                setLoading(true);
                setError(null);

                const data = await getMovieById(movieId);

                setMovie(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load movie details");
            } finally {
                setLoading(false);
            }
        }

        loadMovie();
    }, [movieId]);

    if (loading) {
        return (
            <main className="details-container">
                <p className="status-message">
                    Loading movie...
                </p>
            </main>
        );
    }

    if (error || !movie) {
        return (
            <main className="details-container">
                <p className="status-message error">
                    {error || "Movie not found"}
                </p>

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Go back
                </button>
            </main>
        );
    }

    const releaseYear = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Unknown";

    const director = movie.director || "Unknown";

    const cast = movie.credits?.cast?.slice(0, 10) || [];

    return (
        <main className="details-container">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back to movies
            </button>

            <section className="movie-details">
                <div className="details-backdrop">
                    {movie.backdrop_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                        />
                    )}

                    <div className="backdrop-overlay"></div>
                </div>

                <div className="details-content">
                    <div className="details-poster-container">
                        <div className="details-poster">
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            ) : (
                                <div className="poster-placeholder">
                                    🎬
                                </div>
                            )}
                        </div>

                        {movie.homepage && (
                            <a
                                href={movie.homepage}
                                target="_blank"
                                rel="noreferrer"
                                className="homepage-button"
                            >
                                Official website ↗
                            </a>
                        )}
                    </div>

                    <div className="details-info">
                        <h1>{movie.title}</h1>

                        <div className="details-meta">
                            <span>{releaseYear}</span>

                            {movie.runtime && (
                                <>
                                    <span className="meta-divider">•</span>
                                    <span>{movie.runtime} min</span>
                                </>
                            )}

                            <span className="meta-divider">•</span>

                            <span className="details-rating">
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                        </div>

                        <div className="details-genres">
                            {movie.genres?.map((genre) => (
                                <span
                                    className="genre-tag"
                                    key={genre.id}
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="details-description">
                            <h2>Overview</h2>

                            <p>
                                {movie.overview || "No description available."}
                            </p>
                        </div>

                        <div className="details-facts">
                            <div className="fact-item">
                                <span className="fact-label">
                                    Director
                                </span>

                                <span className="fact-value">
                                    {director}
                                </span>
                            </div>

                            <div className="fact-item">
                                <span className="fact-label">
                                    Release date
                                </span>

                                <span className="fact-value">
                                    {movie.release_date || "Unknown"}
                                </span>
                            </div>

                            <div className="fact-item">
                                <span className="fact-label">
                                    Rating
                                </span>

                                <span className="fact-value">
                                    {movie.vote_average.toFixed(1)} / 10
                                    {" "}({movie.vote_count} votes)
                                </span>
                            </div>

                            <div className="fact-item">
                                <span className="fact-label">
                                    Countries
                                </span>

                                <span className="fact-value">
                                    {movie.production_countries
                                        ?.map((country) => country.name)
                                        .join(", ") || "Unknown"}
                                </span>
                            </div>
                        </div>

                        <div className="details-cast">
                            <h2>Cast</h2>

                            {cast.length > 0 ? (
                                <p>
                                    {cast.map((actor) => actor.name).join(", ")}
                                </p>
                            ) : (
                                <p>No cast information available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MovieDetails;