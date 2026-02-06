import { SignupForm } from "@/components/signup-form";
import { signup, type SignupPayload } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth";

export default function SignupPage() {
    const navigate = useNavigate();
    const { refresh } = useAuth();

    const handleSignup = async (values: SignupPayload) => {
        await signup(values);
        const user = await refresh();
        const destination =
            user?.role === "admin" ? "/dashboard" : "/user-dashboard";
        navigate(destination, { replace: true });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <SignupForm onSignup={handleSignup} />
            </div>
        </div>
    );
}
