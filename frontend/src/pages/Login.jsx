import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../services/api";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const successMessage = location.state?.message;

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setError("");
            setIsSubmitting(true);

            const data = await loginUser(
                username.trim(),
                password
            );

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("username", username.trim());

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-header">
                    <p className="auth-label">Welcome back</p>

                    <h1>Sign in to MovieRec</h1>

                    <p>
                        Sign in to discover movies and get personalized
                        recommendations.
                    </p>
                </div>

                {successMessage && (
                    <p className="auth-message success">
                        {successMessage}
                    </p>
                )}

                {error && (
                    <p className="auth-message error">
                        {error}
                    </p>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span>Username</span>

                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span>Password</span>

                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create an account</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;

