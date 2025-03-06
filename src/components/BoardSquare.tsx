"use client"

import {useRef} from 'react'
import {useDrop} from 'react-dnd'
import {GamePiece, Position} from '@/types/game'
import {useGameContext} from '@/hooks/useGameWebSocket'
import {DragItem, DragItemType} from "@/app/game/[gameCertificate]/utils/drags";
import {BoardPiece} from "@/components/BoardPiece";

const BoardSquare = ({ position, piece }: { position: Position, piece: GamePiece | null}) => {
    const { requestAction } = useGameContext()
    const squareRef = useRef<HTMLDivElement>(null)

    const [, drop] = useDrop(() => ({
        accept: [DragItemType.BOARD_PIECE, DragItemType.HAND_PIECE],
        drop: (item: DragItem) => {
            if (item.type === DragItemType.BOARD_PIECE && item.position) {
                requestAction.makeMove({
                    move: {
                        from: item.position,
                        to: position,
                        toPromote: confirm('Promote this piece?')
                    }
                })
            } else if (item.type === DragItemType.HAND_PIECE && item.pieceType) {
                requestAction.makeDrop({
                    drop: {
                        position,
                        pieceType: item.pieceType
                    }
                })
            } else {
                console.error("Invalid drop")
            }
        }
    }))

    drop(squareRef)

    return (
        <div
            ref={squareRef}
            className="w-16 h-16 bg-amber-100 flex items-center justify-center"
        >
            {piece && <BoardPiece position={position} piece={piece} />}
        </div>
    )
}

export default BoardSquare