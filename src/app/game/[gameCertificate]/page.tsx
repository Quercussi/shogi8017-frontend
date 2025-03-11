import {SessionProvider} from "next-auth/react";
import {GameProvider} from "@/hooks/useGameWebSocket";
import GamePageClient from "@/app/game/[gameCertificate]/pageClient";
import {Toaster} from "@/components/ui/sonner";

export default function GamePage() {
    return (
        <SessionProvider>
            <GameProvider>
                <GamePageClient />
                <Toaster position="top-right" expand={true}
                         toastOptions={{
                             className: "!absolute !right-0 !top-0 !m-0",
                         }}/>
            </GameProvider>
        </SessionProvider>
    );
}