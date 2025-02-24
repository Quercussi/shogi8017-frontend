"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/SignOutButton";
import { useInvitationWebSocket } from "@/hooks/useInvitationWebSocket";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { paginatedSearch } from "@/actions/user";
import { UserModel } from "@/types/user";

export default function HomeContent() {
    const router = useRouter();
    const { data: session } = useSession();
    const { invitations, removeInvitation } = useInvitationWebSocket();
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<UserModel[]>([]);
    const [userSearchOffset, setUserSearchOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const handleJoinGame = (gameCertificate: string) => {
        console.log("Joining game with certificate:", gameCertificate);
        removeInvitation(gameCertificate);
        router.push(`/game/${gameCertificate}`);
    };

    const userPerPage = 5;
    const calculatePageNumber = (offset: number) => Math.floor(offset / userPerPage) + 1;

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            try {
                setIsSearching(true);
                const response = await paginatedSearch({
                    searchQuery: searchQuery,
                    offset: userSearchOffset,
                    limit: userPerPage,
                });

                if (!response.success) throw new Error("Failed to search users");

                const paginatedResult = response.value;
                setUsers(paginatedResult.users);
                setTotalPages(Math.ceil(paginatedResult.total / userPerPage));
            } catch (error) {
                toast.error("Failed to search users");
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, userSearchOffset]);

    const sendInvitation = async (userId: string) => {
        try {
            const response = await fetch("/api/invitations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
                body: JSON.stringify({ invitedUserId: userId }),
            });

            if (!response.ok) throw new Error("Invitation failed");

            const { gameCertificate } = await response.json();
            router.push(`/game/${gameCertificate}`);
            toast.success("Invitation sent successfully!");
        } catch (error) {
            toast.error("Failed to send invitation");
        }
    };

    useEffect(() => {
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
            ), { duration: Infinity });
        });
    }, [invitations]);

    return (
        <div className="min-h-screen flex items-center justify-center gap-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Start a New Game</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Search players..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isSearching ? (
                        // Render a fixed number of skeletons to maintain height
                        <div className="space-y-2">
                            {Array(userPerPage)
                                .fill(0)
                                .map((_, i) => (
                                    <Skeleton key={i} className="w-full h-16" />
                                ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {users.map((user) => (
                                <div key={user.userId} className="flex items-center justify-between p-2 border rounded h-16">
                                    <div>
                                        <div className="font-medium">{user.username}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Username: {user.username}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => sendInvitation(user.userId)}
                                    >
                                        Invite
                                    </Button>
                                </div>
                            ))}
                            {users.length < userPerPage &&
                                Array(userPerPage - users.length)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div
                                            key={`empty-${i}`}
                                            className="h-16 w-full rounded"
                                        />
                                    ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            disabled={userSearchOffset === 0}
                            onClick={() => setUserSearchOffset(prev => Math.max(0, prev - userPerPage))}
                        >
                            Previous
                        </Button>
                        <div className="text-sm">
                            Page {calculatePageNumber(userSearchOffset)} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            disabled={calculatePageNumber(userSearchOffset) >= totalPages}
                            onClick={() => setUserSearchOffset(prev => prev + userPerPage)}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>

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
