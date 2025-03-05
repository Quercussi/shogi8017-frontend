import {SessionProvider} from "next-auth/react";
import {GameProvider} from "@/hooks/useGameWebSocket";
import GamePageClient from "@/app/game/[gameCertificate]/pageClient";

export default function GamePage() {
    return (
        <SessionProvider>
            <GameProvider>
                <GamePageClient />
            </GameProvider>
        </SessionProvider>
    );
}