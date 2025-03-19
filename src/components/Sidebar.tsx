"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GameEventWinnerPairDeterminated, GameEvent, GameWinner } from '@/types/game';
import { Home } from 'lucide-react';

interface SidebarProps {
    userColor: string;
    currentTurn: string;
    onResign: () => void;
    gameOutcome?: GameEventWinnerPairDeterminated | null;
    onReturnHome?: () => void;
}

export default function Sidebar({
    userColor,
    currentTurn,
    onResign,
    gameOutcome,
    onReturnHome
}: SidebarProps) {
    const getColorVariant = (color: string) => {
        if (color.toLowerCase() === "white") {
            return "bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200/80";
        } else if (color.toLowerCase() === "black") {
            return "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700/90";
        }
        return "";
    };

    const getGameEventText = (event?: GameEvent) => {
        switch (event) {
            case GameEvent.CHECKMATE: return "Checkmate";
            case GameEvent.RESIGNATION: return "Resignation";
            case GameEvent.STALEMATE: return "Stalemate";
            case GameEvent.IMPASSE: return "Impasse";
            default: return "Game Over";
        }
    };

    const getWinnerText = (winner: GameWinner) => {
        switch (winner) {
            case GameWinner.WHITE_WINNER: return "White Won";
            case GameWinner.BLACK_WINNER: return "Black Won";
            case GameWinner.DRAW: return "Draw";
            default: return "Unknown Result";
        }
    };

    return (
        <div className="w-1/5 bg-gray-100 p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Game Status</h2>

            <div className="flex items-center gap-2 mb-2">
                <span>You are:</span>
                <Badge className={cn(getColorVariant(userColor))}>
                    {userColor}
                </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span>Current Turn:</span>
                <Badge className={cn(getColorVariant(currentTurn))}>
                    {currentTurn}
                </Badge>
            </div>

            {gameOutcome ? (
                <div className="mt-4 mb-4">
                    <div className="p-3 bg-gray-200 rounded-md border border-gray-300">
                        <h3 className="font-bold text-lg mb-2">
                            {getGameEventText(gameOutcome.gameEvent)}
                        </h3>
                        <p className="text-md font-medium mb-3">
                            {getWinnerText(gameOutcome.winner)}
                        </p>

                        {onReturnHome && (
                            <Button
                                onClick={onReturnHome}
                                variant="default"
                                className="w-full mt-2"
                            >
                                <Home className="h-5 w-5 mr-2" />
                                Return to Home
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <Button
                    onClick={onResign}
                    variant="destructive"
                    className="mt-auto"
                >
                    Resign
                </Button>
            )}
        </div>
    );
}