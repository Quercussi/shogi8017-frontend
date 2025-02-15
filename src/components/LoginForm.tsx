"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {authenticate} from "@/actions/auth";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await authenticate(data.username, data.password)
            if (result.error) {
                setErrorMessage(result.error);
            } else {
                window.location.href = "/home";
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
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="Enter your username"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
