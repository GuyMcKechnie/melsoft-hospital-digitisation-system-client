import { z } from "zod"

export const loginFormSchema = z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
})

export const signupFormSchema = z
    .object({
        firstName: z.string().min(1, "First name is required."),
        lastName: z.string().min(1, "Last name is required."),
        email: z.string().email("Enter a valid email address."),
        idNumber: z.string().min(1, "ID number is required."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters."),
        confirmPassword: z
            .string()
            .min(8, "Password must be at least 8 characters."),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export const forgotPasswordSchema = z.object({
    email: z.string().email("Enter a valid email address."),
})
