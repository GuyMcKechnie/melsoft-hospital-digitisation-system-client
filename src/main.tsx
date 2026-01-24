import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Toaster } from "sonner";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <App />
            <Toaster richColors />
        </BrowserRouter>
    </StrictMode>,
);
