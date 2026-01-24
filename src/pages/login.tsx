import { LoginForm } from "@/components/login-form";
import { login, type LoginPayload } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const handleSubmit = async (values: LoginPayload) => {
        try {
            // await login(values);
            console.table(values);
            toast.success("Logged in successfully.");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Login failed.");  
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm onLogin={handleSubmit} />
            </div>
        </div>
    );
}
