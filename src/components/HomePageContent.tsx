"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/SignOutButton";
import { useInvitationWebSocket } from "@/hooks/useInvitationWebSocket";
import { toast } from "sonner";
import {Button} from "@/components/ui/button";

export default function HomeContent() {
    const { data: session } = useSession();
    const { invitations, removeInvitation } = useInvitationWebSocket();

    const handleJoinGame = (gameCertificate: string) => {
        console.log("Joining game with certificate:", gameCertificate);
        removeInvitation(gameCertificate);
        // Add actual game joining logic here
    };

    useEffect(() => {
        toast.dismiss()
        invitations.forEach(invitation => {
            toast.custom((t) => (
                <div className="flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-lg">
                    <div className="font-semibold">Game Invitation</div>
                    <div>{invitation.invitingUser.username} invited you to a game!</div>
                    <div className="flex gap-2 mt-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                handleJoinGame(invitation.gameCertificate);
                                toast.dismiss(t);
                            }}
                        >
                            Join Now
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                removeInvitation(invitation.gameCertificate);
                                toast.dismiss(t);
                            }}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            ), {
                duration: Infinity,
            });
        });
    }, [invitations]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Welcome {session?.user?.username || "Guest"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SignOutButton />
                </CardContent>
            </Card>
        </div>
    );
}