import { Routes, Route, Navigate  } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommendations from "./pages/Recommendations";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies/:movieId" element={<MovieDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recommendations" element={<ProtectedRoute> <Recommendations /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

export default App;