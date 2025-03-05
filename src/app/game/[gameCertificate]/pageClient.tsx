"use client";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {Toaster} from "@/components/ui/sonner";
import GameContent from "@/app/game/[gameCertificate]/GameContent";

export default function GamePageClient() {
    return (
        <DndProvider backend={HTML5Backend}>
            <GameContent/>
            <Toaster position="top-right" expand={true}
                     toastOptions={{
                         className: "!absolute !right-0 !top-0 !m-0",
                     }}/>
        </DndProvider>
    )
}

function isTouchDevice() {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
