"use client"

import { useDrag } from 'react-dnd'
import { ShogiPiece } from './ShogiPiece'
import {GamePiece, Owner, Position} from "@/types/game"
import {DragItemBoard, DragItemType} from "@/app/game/[gameCertificate]/utils/drags";
import {useRef} from "react";

interface BoardPieceProps {
    piece: GamePiece
    position: Position
}

export const BoardPiece = ({ piece, position }: BoardPieceProps) => {
    const pieceRef = useRef<HTMLDivElement>(null)

    const [{ isDragging, canDrag }, drag] = useDrag(() => ({
        type: DragItemType.BOARD_PIECE,
        item: {
            type: DragItemType.BOARD_PIECE,
            pieceType: piece.type,
            position
        } as DragItemBoard,
        canDrag: piece.owner === Owner.PLAYER,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: monitor.canDrag(),
        })
    }))

    drag(pieceRef)

    return (
        <div
            ref={pieceRef}
            className={`w-full h-full ${
                isDragging
                    ? 'opacity-50 cursor-move'
                    : (canDrag ? 'cursor-pointer' : 'cursor-default')
            }`}
        >
            <ShogiPiece piece={piece} className="w-full h-full" />
        </div>
    )
}