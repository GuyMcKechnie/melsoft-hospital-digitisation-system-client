import { SignupForm } from "@/components/signup-form";
import { signup, type SignupPayload } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const navigate = useNavigate();

    const handleSignup = async (values: SignupPayload) => {
        try {
            await signup(values);
            toast.success("Account created successfully.");
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Signup failed.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <SignupForm onSignup={handleSignup} />
            </div>
        </div>
    );
}
