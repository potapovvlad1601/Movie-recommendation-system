
function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <a href="/" className="logo">
                    <span className="logo-icon">🎬</span>
                    MovieRec
                </a>

                <nav className="navigation">
                    <a href="/" className="nav-link active">
                        Home
                    </a>

                    <a href="#" className="nav-link">
                        Movies
                    </a>

                    <a href="#" className="nav-link">
                        My Recommendations
                    </a>
                </nav>

                <div className="header-actions">
                    <button className="login-button">
                        Login
                    </button>

                    <button className="register-button">
                        Register
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
