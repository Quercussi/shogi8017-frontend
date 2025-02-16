"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/SignOutButton";

export default function HomeContent() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome {session?.user?.username || "Guest"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SignOutButton />
                    </CardContent>
            </Card>
        </div>
    );
}
