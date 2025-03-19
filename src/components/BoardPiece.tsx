"use client"

import { useDrag } from 'react-dnd'
import { ShogiPiece } from './ShogiPiece'
import { GamePiece, Player, Position } from "@/types/game"
import { DragItemBoard, DragItemType } from "@/app/game/[gameCertificate]/utils/drags"
import { useRef } from "react"
import { Maybe } from "@/types/type-constructor"

interface BoardPieceProps {
    userColor: Maybe<Player>,
    piece: GamePiece
    position: Position
    viewOnly?: boolean
}

function StaticPiece({ userColor, piece }: Pick<BoardPieceProps, 'userColor' | 'piece'>) {
    return (
        <div className="w-full h-full cursor-default">
            <ShogiPiece userColor={userColor} piece={piece} className="w-full h-full" />
        </div>
    )
}

function DraggablePiece({ userColor, piece, position }: Omit<BoardPieceProps, 'viewOnly'>) {
    const pieceRef = useRef<HTMLDivElement>(null)

    const [{ isDragging, canDrag }, drag] = useDrag(() => ({
        type: DragItemType.BOARD_PIECE,
        item: {
            type: DragItemType.BOARD_PIECE,
            pieceType: piece.type,
            position: position,
            owner: piece.owner,
        } as DragItemBoard,
        canDrag: piece.owner === userColor,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: monitor.canDrag(),
        })
    }), [piece, userColor, position])

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
            <ShogiPiece userColor={userColor} piece={piece} className="w-full h-full" />
        </div>
    )
}

// Main component that decides which version to render
export const BoardPiece = (props: BoardPieceProps) => {
    const { viewOnly = false, userColor, piece, position } = props

    if (viewOnly) {
        return <StaticPiece userColor={userColor} piece={piece} />
    }

    return <DraggablePiece userColor={userColor} piece={piece} position={position} />
}