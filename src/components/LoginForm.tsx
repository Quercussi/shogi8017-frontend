"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticate } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/InputField";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await authenticate(data.username, data.password);
            if (result.error) {
                setErrorMessage(result.error);
            } else {
                router.push("/");
            }
        } catch (err) {
            setErrorMessage("Login failed. Please try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
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
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-primary underline">
                            Sign up here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </form>
    );
}