import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
