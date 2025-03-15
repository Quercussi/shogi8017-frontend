"use client"

import { GamePiece, Owner } from "@/types/game"

export const getPiecePath = (pieceType: string): string => {
    return `/pieces/${pieceType.replace('P_', 'p-').toLowerCase()}.svg`;
};

interface ShogiPieceProps {
    piece: GamePiece
    className?: string
}

export const ShogiPiece = ({ piece, className }: ShogiPieceProps) => {
    return (
        <div className={`${className} ${piece.owner === Owner.OPPONENT ? 'rotate-180' : ''}`}>
            <img
                src={getPiecePath(piece.type)}
                alt={piece.type}
                className="w-full h-full object-contain"
            />
        </div>
    )
}