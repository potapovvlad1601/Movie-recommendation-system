import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const isLoggedIn = Boolean(token);

    function handleLogout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");

        navigate("/", { replace: true });
    }

    return (
        <header className="header">
            <div className="header-container">

                <Link to="/" className="logo">
                    <span className="logo-icon">🎬</span>
                    MovieRec
                </Link>

                {isLoggedIn && (
                    <nav className="navigation">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>

                        <Link to="/movies" className="nav-link">
                            Movies
                        </Link>

                        <Link to="/recommendations" className="nav-link">
                            My Recommendations
                        </Link>
                    </nav>
                )}

                <div className="header-actions">
                    {isLoggedIn ? (
                        <>
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                            <span className="username">
                                {username}
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                className="login-button"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>

                            <button
                                className="register-button"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}

export default Header;

