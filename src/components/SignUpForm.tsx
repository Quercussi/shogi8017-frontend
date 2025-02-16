"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { signUp } from "@/actions/user";
import { TUserSignUpPayload } from "@/types/user";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";

type FormValues = {
    username: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpForm() {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // TODO: fix the bug of sign up error
            const payload: TUserSignUpPayload = data;
            const result = await signUp(payload);

            if (result.success) {
                setSuccessMessage("Account created successfully! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setErrorMessage(result.error || "We couldn't complete your sign-up. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="w-full max-w-md">
            {successMessage ? (
                <Card className="text-center p-6">
                    <Alert variant="default">
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                </Card>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Create Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InputField
                                id="username"
                                label="Username"
                                placeholder="Enter your username"
                                register={register("username", { required: "Username is required" })}
                                error={errors.username?.message}
                            />
                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                register={register("password", { required: "Password is required" })}
                                error={errors.password?.message}
                            />
                            <InputField
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your password"
                                register={register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === watch("password") || "Passwords do not match",
                                })}
                                error={errors.confirmPassword?.message}
                            />
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Creating account..." : "Sign Up"}
                            </Button>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary underline">
                                    Login here
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            )}
        </div>
    );
}