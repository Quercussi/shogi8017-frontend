"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { paginatedGet } from "@/actions/game";
import { getById } from "@/actions/user";
import {GameModel, GameState, GameWinner} from "@/types/game";
import { UserModel } from "@/types/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

export default function GamesCard() {
    const router = useRouter();
    const { data: session } = useSession();
    const [games, setGames] = useState<GameModel[]>([]);
    const [gameSearchOffset, setGameSearchOffset] = useState(0);
    const [totalGamePages, setTotalGamePages] = useState(1);
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const [userCache, setUserCache] = useState<Record<string, UserModel | null>>({});

    const gamesPerPage = 5;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoadingGames(true);
                const payload = {
                    offset: gameSearchOffset,
                    limit: gamesPerPage
                };

                const response = await paginatedGet(payload);

                if (!response.success) throw new Error("Failed to fetch games");

                const paginatedResult = response.value;
                setGames(paginatedResult.games);
                setTotalGamePages(Math.ceil(paginatedResult.total / gamesPerPage));

                // Prefetch users for the games
                paginatedResult.games.forEach(game => {
                    fetchUserIfNeeded(game.whiteUserId.toString());
                    fetchUserIfNeeded(game.blackUserId.toString());
                });
            } catch (error) {
                toast.error("Failed to load games");
            } finally {
                setIsLoadingGames(false);
            }
        };

        fetchGames();
    }, [session, gameSearchOffset]);

    const fetchUserIfNeeded = async (userId: string) => {
        if (userCache[userId]) return;

        try {
            const response = await getById({ userId });
            if (response.success && response.value) {
                const user: UserModel = response.value;
                setUserCache(prev => ({
                    ...prev,
                    [userId]: user
                }));
            }
        } catch (error) {
            console.error("Failed to fetch user", userId);
        }
    };

    const handleJoinGame = (gameCertificate: string) => {
        router.push(`/game/${gameCertificate}`);
    };

    const getUserRole = (game: GameModel) => {
        if (!session?.user?.userInfo.userId) return null;

        if (game.whiteUserId === session.user.userInfo.userId) return "White";
        if (game.blackUserId === session.user.userInfo.userId) return "Black";
        return null;
    };

    const getStatusBadge = (game: GameModel) => {
        switch (game.gameState) {
            case GameState.PENDING:
                return <Badge variant="secondary">Pending</Badge>;

            case GameState.ON_GOING:
                return <Badge variant="secondary">In progress</Badge>;

            case GameState.FINISHED:
                return <Badge variant="default">Finished</Badge>;

            default:
                return <Badge variant="destructive">Unknown</Badge>;
        }
    };

    const getOutcomeBadge = (game: GameModel) => {
        if (!game.winner) return null;

        const userRole = getUserRole(game);
        if (!userRole) return null;

        if (game.winner === GameWinner.DRAW) {
            return <Badge variant="outline">Draw</Badge>;
        }

        const isUserWinner =
            (userRole === "White" && game.winner === GameWinner.WHITE_WINNER) ||
            (userRole === "Black" && game.winner === GameWinner.BLACK_WINNER);

        return isUserWinner ?
            <Badge className="bg-green-500 hover:bg-green-600 text-white" variant="default">Win</Badge> :
            <Badge variant="destructive">Loss</Badge>;
    };

    const formatGameTitle = (game: GameModel) => {
        const whiteUser = userCache[game.whiteUserId.toString()];
        const blackUser = userCache[game.blackUserId.toString()];

        const whiteName = whiteUser?.username || "...";
        const blackName = blackUser?.username || "...";
        const date = dayjs(game.createdAt).format("MMM D, YYYY h:mm A");

        return `${blackName} vs. ${whiteName} (${date})`;
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>My Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoadingGames ? (
                    <div className="space-y-2">
                        {Array(gamesPerPage)
                            .fill(0)
                            .map((_, i) => (
                                <Skeleton key={i} className="w-full h-16" />
                            ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {games.map((game) => (
                            <div key={game.gameId.toString()} className="flex items-center justify-between p-2 border rounded h-16">
                                <div>
                                    <div className="font-medium">
                                        {formatGameTitle(game)}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(game)}
                                        {getOutcomeBadge(game)}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleJoinGame(game.gameCertificate.toString())}
                                >
                                    Resume
                                </Button>
                            </div>
                        ))}
                        {games.length < gamesPerPage &&
                            Array(gamesPerPage - games.length)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={`empty-game-${i}`}
                                        className="h-16 w-full rounded"
                                    />
                                ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        disabled={gameSearchOffset === 0}
                        onClick={() => setGameSearchOffset(prev => Math.max(0, prev - gamesPerPage))}
                    >
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {Math.floor(gameSearchOffset / gamesPerPage) + 1} of {totalGamePages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={Math.floor(gameSearchOffset / gamesPerPage) + 1 >= totalGamePages}
                        onClick={() => setGameSearchOffset(prev => prev + gamesPerPage)}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}