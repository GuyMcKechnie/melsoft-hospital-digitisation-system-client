import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { forgotPasswordSchema } from "@/lib/validation-schemas";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: ForgotPasswordValues) => {
        if (!values.email) return;
        toast.success("Password reset link sent. Check your email.");
        reset();
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="absolute right-6 top-6">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden p-0">
                    <CardContent className="p-6 md:p-8">
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">
                                        Reset your password
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Enter your email and we&apos;ll send you
                                        a reset link.
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@hospus.com"
                                        autoComplete="email"
                                        {...register("email")}
                                    />
                                    <FieldError errors={[errors.email]} />
                                </Field>
                                <div className="flex gap-4">
                                    <Field>
                                        <Button type="submit">
                                            Send reset link
                                        </Button>
                                    </Field>
                                    <Field>
                                        <Button>
                                            <Link to="/login">
                                                Back to Login
                                            </Link>
                                        </Button>
                                    </Field>
                                </div>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
