import {GamePiece} from "@/types/game";
import {useDrag} from "react-dnd";
import {useRef} from "react";
import {DragItemHand, DragItemType} from "@/app/game/[gameCertificate]/utils/drags";

export default function HandPiece({ piece }: { piece: GamePiece }) {
    const [{ isDragging }, drag] = useDrag(() => {
        const payload: DragItemHand = {type: DragItemType.HAND_PIECE, pieceType: piece.type}
        return {
            type: DragItemType.HAND_PIECE,
            item: payload,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }
    })

    const ref = useRef<HTMLDivElement>(null)
    drag(ref)

    return (
        <div
            ref={ref}
            className={`h-12 w-12 flex items-center justify-center border rounded ${
                isDragging ? 'opacity-50' : 'opacity-100'
            }`}
        >
            <img
                src={`/pieces/${piece.type.replace('P_', 'P-')}.svg`}
                alt={piece.type}
                className="w-8 h-8"
            />
        </div>
    )
}
