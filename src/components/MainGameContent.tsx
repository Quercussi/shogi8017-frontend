"use client";

import React from 'react';
import GameBoardComponent from '@/components/GameBoardComponent';
import HandBoard from '@/components/HandBoard';
import { GameBoard, Player } from '@/types/game';
import { Maybe } from "@/types/type-constructor";

interface MainGameContentProps {
    board: GameBoard;
    opponentHand: any[];
    playerHand: any[];
    currentPlayer: Player;
    userColor: Maybe<Player>;
    viewOnly?: boolean;
}

export default function MainGameContent({
        board,
        opponentHand,
        playerHand,
        currentPlayer,
        userColor,
        viewOnly = false
    }: MainGameContentProps) {
    return (
        <div className="flex flex-row gap-12 justify-center items-center w-full p-2">
            {/* Left column: Game Board */}
            <div>
                <GameBoardComponent
                    board={board}
                    currentPlayer={currentPlayer}
                    userColor={userColor}
                    viewOnly={viewOnly}
                />
            </div>

            {/* Right column: Hand Boards */}
            <div className="w-1/3 flex flex-col justify-center items-center gap-2">
                {/* Opponent Hand Board */}
                <div className="w-full">
                    <HandBoard pieces={opponentHand} viewOnly={viewOnly} />
                </div>

                {/* Player Hand Board */}
                <div className="w-full">
                    <HandBoard pieces={playerHand} viewOnly={viewOnly} />
                </div>
            </div>
        </div>
    );
}