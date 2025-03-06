"use client"

import { GamePiece, Owner } from "@/types/game"

interface ShogiPieceProps {
    piece: GamePiece
    className?: string
}

export const ShogiPiece = ({ piece, className }: ShogiPieceProps) => {
    return (
        <div className={`${className} ${piece.owner === Owner.OPPONENT ? 'rotate-180' : ''}`}>
            <img
                src={`/pieces/${piece.type.replace('P_', 'P-')}.svg`}
                alt={piece.type}
                className="w-full h-full object-contain"
            />
        </div>
    )
}