import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Onboarding } from "@/assets/assets";
import { Link } from "react-router-dom";
import { loginFormSchema } from "@/lib/validation-schemas";

type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginFormProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
    onLogin?: (values: LoginFormValues) => void | Promise<void>;
};

export function LoginForm({ className, onLogin, ...props }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        await onLogin?.(values);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    Welcome back
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Hospus account
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@hospus.com"
                                    autoComplete="email"
                                    {...register("email")}
                                />
                                <FieldError errors={[errors.email]} />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <FieldDescription className="align-right ml-auto">
                                        <Link to="/forgot-password">
                                            Forgot password?
                                        </Link>
                                    </FieldDescription>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register("password")}
                                />
                                <FieldError errors={[errors.password]} />
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup">Sign up</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted hidden md:flex md:items-center md:justify-center">
                        <img
                            src={Onboarding}
                            alt="image of hospital staff"
                            className="inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
