import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // сколько времени данные считаются свежими и не перезапрашиваются
            staleTime: 5 * 60 * 1000,
            // время жизни кэша в памяти
            gcTime: 30 * 60 * 1000,
            // не перезапрашивать при фокусе окна
            refetchOnWindowFocus: false,
            // слегка снизим агрессивность повторов
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);

// npm run dev