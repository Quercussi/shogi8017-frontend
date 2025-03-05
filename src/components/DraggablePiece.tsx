"use client"

import { useDrag } from 'react-dnd'
import { useRef } from 'react'
import ShogiPiece from './ShogiPiece'
import {GamePiece, Owner, Position} from "@/types/game";
import {DragItemType} from "@/app/game/[gameCertificate]/utils/drags";

const DraggablePiece = ({ position, piece }: {position: Position, piece: GamePiece}) => {
    const pieceRef = useRef<HTMLDivElement>(null)

    const [, drag] = useDrag(() => ({
        type: DragItemType.BOARD_PIECE,
        item: { type: DragItemType.BOARD_PIECE, position, pieceType: piece.type },
        canDrag: piece.owner === Owner.PLAYER
    }))

    drag(pieceRef)

    return (
        <div
            ref={pieceRef}
            className="w-full h-full flex items-center justify-center cursor-move"
        >
            <ShogiPiece piece={piece} position={position} />
        </div>
    )
}

export default DraggablePiece