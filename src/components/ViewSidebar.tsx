"use client";

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowLeftRight, Home } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewSidebarProps {
    userColor: string;
    currentTurn: string;
    currentMoveIndex: number;
    totalMoves: number;
    currentNotation: string;
    onNext: () => void;
    onPrevious: () => void;
    onTogglePerspective: () => void;
    onReturnHome: () => void;
}

function ViewSidebar({
    userColor,
    currentTurn,
    currentMoveIndex,
    totalMoves,
    currentNotation,
    onNext,
    onPrevious,
    onTogglePerspective,
    onReturnHome
}: ViewSidebarProps) {
    const getColorVariant = (color: string) => {
        if (color.toLowerCase() === "white") {
            return "bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200/80";
        } else if (color.toLowerCase() === "black") {
            return "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700/90";
        }
        return ""; // Default
    };

    return (
        <div className="w-1/5 bg-gray-100 p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Game History</h2>

            <div className="flex items-center gap-2 mb-2">
                <span>Viewing as:</span>
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

            <div className="mb-4">
                <p className="font-medium">Current Move: {currentMoveIndex + 1}/{totalMoves}</p>
                <p className="text-sm">{currentNotation || "Initial position"}</p>
            </div>

            <div className="flex justify-between mb-6 gap-2">
                <Button
                    onClick={onPrevious}
                    disabled={currentMoveIndex < 0}
                    variant={currentMoveIndex < 0 ? "outline" : "default"}
                    size="icon"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <Button
                    onClick={onNext}
                    disabled={currentMoveIndex >= totalMoves - 1}
                    variant={currentMoveIndex >= totalMoves - 1 ? "outline" : "default"}
                    size="icon"
                >
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>

            <Button
                onClick={onTogglePerspective}
                variant="outline"
                className="mb-4"
            >
                <ArrowLeftRight className="h-5 w-5 mr-2" />
                Switch Perspective
            </Button>

            <Button
                onClick={onReturnHome}
                variant="outline"
                className="mt-auto"
            >
                <Home className="h-5 w-5 mr-2" />
                Return to Home
            </Button>
        </div>
    );
}

export default ViewSidebar;