import { LoginForm } from "@/components/login-form";
import { login, type LoginPayload } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
    const navigate = useNavigate();
    const isDev = import.meta.env.MODE === "development" || (import.meta.env as any).ENVIRONMENT === "development";

    const handleSubmit = async (values: LoginPayload) => {
        if (isDev) {
            console.info("Development mode: bypassing auth");
            navigate("/dashboard", { replace: true });
            return;
        }

        await login(values);
        navigate("/dashboard", { replace: true });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm onLogin={handleSubmit} />
            </div>
        </div>
    );
}
