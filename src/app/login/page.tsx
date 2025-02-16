// This is a server component (no "use client" here)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
    const session = await auth();
    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <LoginForm />
        </div>
    );
}
