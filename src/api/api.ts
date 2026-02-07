import axios from "axios";

const string = import.meta.env.VITE_API_URL;

const validate = {
    if: (typeof string === "string" && string.trim() !== ""),
    else: () => {
        console.warn(
            "VITE_API_URL is not set or empty. API requests will fail. Please set VITE_API_URL in your .env file."
        );
    }
}

const api = axios.create({
    baseURL: validate.if ? string : undefined,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;