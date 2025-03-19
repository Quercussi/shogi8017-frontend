"use client"

import { useDrag } from 'react-dnd'
import { ShogiPiece } from './ShogiPiece'
import { GamePiece } from "@/types/game"
import { DragItemHand, DragItemType } from "@/app/game/[gameCertificate]/utils/drags"
import { useRef } from "react"

interface HandPieceProps {
    piece: GamePiece
    viewOnly?: boolean
}

function StaticHandPiece({ piece }: Omit<HandPieceProps, 'viewOnly'>) {
    return (
        <div className="w-12 h-12 cursor-default">
            <ShogiPiece userColor={piece.owner} piece={piece} className="w-full h-full" />
        </div>
    )
}

function DraggableHandPiece({ piece }: Omit<HandPieceProps, 'viewOnly'>) {
    const pieceRef = useRef<HTMLDivElement>(null)

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemType.HAND_PIECE,
        item: {
            type: DragItemType.HAND_PIECE,
            pieceType: piece.type,
        } as DragItemHand,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }), [piece])

    drag(pieceRef)

    return (
        <div
            ref={pieceRef}
            className={`w-12 h-12 ${isDragging ? 'opacity-50' : ''} cursor-grab`}
        >
            <ShogiPiece userColor={piece.owner} piece={piece} className="w-full h-full" />
        </div>
    )
}

export const HandPiece = (props: HandPieceProps) => {
    const { viewOnly = false, piece } = props

    if (viewOnly) {
        return <StaticHandPiece piece={piece} />
    }

    return <DraggableHandPiece piece={piece} />
}