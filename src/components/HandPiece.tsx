"use client"

import { useDrag } from 'react-dnd'
import { ShogiPiece } from './ShogiPiece'
import {GamePiece, Owner} from "@/types/game"
import {DragItemHand, DragItemType} from "@/app/game/[gameCertificate]/utils/drags";
import {useRef} from "react";

interface HandPieceProps {
    piece: GamePiece
}

export const HandPiece = ({ piece }: HandPieceProps) => {
    const pieceRef = useRef<HTMLDivElement>(null)

    const [{ isDragging, canDrag }, drag] = useDrag(() => ({
        type: DragItemType.HAND_PIECE,
        item: {
            type: DragItemType.HAND_PIECE,
            pieceType: piece.type
        } as DragItemHand,
        canDrag: piece.owner === Owner.PLAYER,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: monitor.canDrag()
        })
    }))

    drag(pieceRef)

    return (
        <div
            ref={pieceRef}
            className={`h-12 w-12 border rounded ${
                isDragging
                    ? 'opacity-50 cursor-move'
                    : (canDrag ? 'cursor-pointer' : 'cursor-default')
            }`}
        >
            <ShogiPiece piece={piece} className="w-8 h-8" />
        </div>
    )
}