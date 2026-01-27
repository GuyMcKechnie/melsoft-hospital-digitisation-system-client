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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Onboarding } from "@/assets/assets";
import { Link } from "react-router-dom";
import { signupFormSchema } from "@/lib/validation-schemas";
import { toast } from "sonner";

type SignupFormValues = z.infer<typeof signupFormSchema>;

type SignupFormProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
    onSignup?: (values: SignupFormValues) => void | Promise<void>;
};

export function SignupForm({ className, onSignup, ...props }: SignupFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            idNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        try {
            await onSignup?.(values);
            toast.success("Account created successfully.");
        } catch (error) {
            console.error("Signup error", error);
            toast.error("Signup failed. Please try again.");
        }
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
                                    Create your account
                                </h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to create your
                                    account
                                </p>
                            </div>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="firstName">
                                            First Name
                                        </FieldLabel>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            autoComplete="given-name"
                                            {...register("firstName")}
                                        />
                                        <FieldError
                                            errors={[errors.firstName]}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="lastName">
                                            Last Name
                                        </FieldLabel>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            autoComplete="family-name"
                                            {...register("lastName")}
                                        />
                                        <FieldError
                                            errors={[errors.lastName]}
                                        />
                                    </Field>
                                </Field>
                            </Field>
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
                                <FieldDescription>
                                    We&apos;ll use this to contact you. We will
                                    not share your email with anyone else.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="idNumber">
                                    ID Number
                                </FieldLabel>
                                <Input
                                    id="idNumber"
                                    type="text"
                                    placeholder="8001015009087"
                                    autoComplete="off"
                                    {...register("idNumber")}
                                />
                                <FieldError errors={[errors.idNumber]} />
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="new-password"
                                            {...register("password")}
                                        />
                                        <FieldError
                                            errors={[errors.password]}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            {...register("confirmPassword")}
                                        />
                                        <FieldError
                                            errors={[errors.confirmPassword]}
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit">Create Account</Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Already have an account?{" "}
                                <Link to="/">Sign in</Link>
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
