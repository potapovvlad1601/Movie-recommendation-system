import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);

            await registerUser({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            navigate("/login", {
                state: {
                    message: "Account created. You can sign in now.",
                },
            });
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
                    <p className="auth-label">Join MovieRec</p>
                    <h1>Create your account</h1>
                    <p>Start building a profile for better recommendations.</p>
                </div>

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
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span>Password</span>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={14}
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span>Confirm Password</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={14}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;
