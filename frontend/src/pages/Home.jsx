
function Home() {
    return (
        <main className="home">
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-label">MOVIE RECOMMENDATION SYSTEM</p>

                    <h1>
                        Find your next
                        <span> favorite movie</span>
                    </h1>

                    <p className="hero-description">
                        Discover movies you'll love based on your preferences
                        and viewing history.
                    </p>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search for a movie..."
                            className="search-input"
                        />

                        <button className="search-button">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <section className="movies-section">
                <div className="section-header">
                    <h2>Popular Movies</h2>
                    <button className="view-all-button">
                        View all →
                    </button>
                </div>

                <div className="movie-grid">
                    <div className="movie-card">
                        <div className="movie-poster">
                            <span>🎬</span>
                        </div>

                        <div className="movie-info">
                            <h3>Movie Title</h3>
                            <p>2026</p>

                            <div className="movie-rating">
                                ★ 8.5
                            </div>
                        </div>
                    </div>

                    <div className="movie-card">
                        <div className="movie-poster">
                            <span>🎬</span>
                        </div>

                        <div className="movie-info">
                            <h3>Another Movie</h3>
                            <p>2025</p>

                            <div className="movie-rating">
                                ★ 8.1
                            </div>
                        </div>
                    </div>

                    <div className="movie-card">
                        <div className="movie-poster">
                            <span>🎬</span>
                        </div>

                        <div className="movie-info">
                            <h3>Great Movie</h3>
                            <p>2025</p>

                            <div className="movie-rating">
                                ★ 7.9
                            </div>
                        </div>
                    </div>

                    <div className="movie-card">
                        <div className="movie-poster">
                            <span>🎬</span>
                        </div>

                        <div className="movie-info">
                            <h3>New Release</h3>
                            <p>2026</p>

                            <div className="movie-rating">
                                ★ 8.3
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home