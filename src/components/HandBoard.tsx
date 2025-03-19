"use client";

import React from 'react';
import { HandPiece } from '@/components/HandPiece';
import { GamePiece } from "@/types/game";

interface HandBoardProps {
    pieces: GamePiece[];
    viewOnly?: boolean;
}

export default function HandBoard({ pieces, viewOnly = false }: HandBoardProps) {
    return (
        <div className="grid grid-cols-3 gap-2 h-72 border rounded">
            {pieces.map((piece, index) => (
                <div key={index} className="flex items-center justify-center border">
                    <HandPiece piece={piece} viewOnly={viewOnly} />
                </div>
            ))}
        </div>
    );
}