"use client"

import {GamePiece, Player} from "@/types/game"
import {Maybe} from "@/types/type-constructor";

export const getPiecePath = (pieceType: string): string => {
    return `/pieces/${pieceType.replace('P_', 'p-').toLowerCase()}.svg`;
};

interface ShogiPieceProps {
    userColor: Maybe<Player>
    piece: GamePiece
    className?: string
}

export const ShogiPiece = ({ userColor, piece, className }: ShogiPieceProps) => {
    const toRotate = piece.owner === userColor

    return (
        <div className={`${className} ${toRotate ? '' : 'rotate-180'}`}>
            <img
                src={getPiecePath(piece.type)}
                alt={piece.type}
                className="w-full h-full object-contain"
            />
        </div>
    )
}