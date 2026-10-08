import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getMovieById,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getRatings,
    rateMovie,
    removeRating,
} from "../services/api";

function MovieDetails() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const { data: movie, isLoading, isError, error } = useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => getMovieById(movieId),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const [isFavorite, setIsFavorite] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [userRating, setUserRating] = useState(null);

    const [userActionsLoading, setUserActionsLoading] = useState(false);
    const [actionError, setActionError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLoggedIn = Boolean(localStorage.getItem("access_token"));

    useEffect(() => {
        async function loadUserActions() {
            if (!isLoggedIn) {
                setIsFavorite(false);
                setInWatchlist(false);
                setUserRating(null);
                return;
            }

            try {
                setUserActionsLoading(true);
                setActionError("");

                const [favoritesData, watchlistData, ratingsData] =
                    await Promise.all([
                        getFavorites(),
                        getWatchlist(),
                        getRatings(),
                    ]);

                const numericMovieId = Number(movieId);

                setIsFavorite(
                    favoritesData.items.some(
                        (item) => item.movie_id === numericMovieId
                    )
                );

                setInWatchlist(
                    watchlistData.items.some(
                        (item) => item.movie_id === numericMovieId
                    )
                );

                const ratingEntry = ratingsData.items.find(
                    (item) => item.movie_id === numericMovieId
                );

                setUserRating(ratingEntry?.rating ?? null);
            } catch (error) {
                console.error(error);
                setActionError(error.message);
            } finally {
                setUserActionsLoading(false);
            }
        }

        loadUserActions();
    }, [movieId, isLoggedIn]);

    async function handleFavorite() {
        try {
            setIsSubmitting(true);
            setActionError("");

            if (isFavorite) {
                await removeFromFavorites(movieId);
                setIsFavorite(false);
            } else {
                await addToFavorites(movieId);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error(error);
            setActionError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleWatchlist() {
        try {
            setIsSubmitting(true);
            setActionError("");

            if (inWatchlist) {
                await removeFromWatchlist(movieId);
                setInWatchlist(false);
            } else {
                await addToWatchlist(movieId);
                setInWatchlist(true);
            }
        } catch (error) {
            console.error(error);
            setActionError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleRatingChange(event) {
        const newRating = Number(event.target.value);

        try {
            setIsSubmitting(true);
            setActionError("");

            if (newRating === 0) {
                await removeRating(movieId);
                setUserRating(null);
            } else {
                await rateMovie(movieId, newRating);
                setUserRating(newRating);
            }
        } catch (error) {
            console.error(error);
            setActionError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="details-container">
                <p className="status-message">
                    Loading movie...
                </p>
            </main>
        );
    }

    if (isError || !movie) {
        return (
            <main className="details-container">
                <p className="status-message error">
                    {error?.message || "Movie not found"}
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

                        <div className="movie-actions">
                            {isLoggedIn ? (
                                <>
                                    <div className="movie-actions-buttons">
                                        <button
                                            className={`action-button ${isFavorite ? "active" : ""}`}
                                            onClick={handleFavorite}
                                            disabled={isSubmitting}
                                        >
                                            {isFavorite ? "♥ In Favorites" : "♡ Add to Favorites"}
                                        </button>

                                        <button
                                            className={`action-button ${inWatchlist ? "active" : ""}`}
                                            onClick={handleWatchlist}
                                            disabled={isSubmitting}
                                        >
                                            {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                                        </button>
                                    </div>

                                    <div className="rating-control">
                                        <label htmlFor="movie-rating">Your rating</label>

                                        <select
                                            id="movie-rating"
                                            value={userRating ?? 0}
                                            onChange={handleRatingChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value={0}>Not rated</option>

                                            {Array.from({ length: 10 }, (_, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1} / 10
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {actionError && (
                                        <p className="action-error">{actionError}</p>
                                    )}
                                </>
                            ) : (
                                <button
                                    className="action-button"
                                    onClick={() => navigate("/login")}
                                >
                                    Sign in to save movies
                                </button>
                            )}
                        </div>
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