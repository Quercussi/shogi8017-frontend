import {GamePiece, Owner, Position} from "@/types/game";
import {useDrag} from "react-dnd";
import {useRef} from "react";
import {DragItemBoard, DragItemType} from "@/app/game/[gameCertificate]/utils/drags";

export default function ShogiPiece ({ piece, position }: { piece: GamePiece, position: Position }) {
    const [{ isDragging }, drag] = useDrag(() => {
        const payload: DragItemBoard = {type: DragItemType.BOARD_PIECE, pieceType: piece.type, position: position}
        return {
            type: DragItemType.BOARD_PIECE,
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
            className={`w-full h-full flex items-center justify-center ${
                isDragging ? 'opacity-50' : 'opacity-100'
            }`}
        >
            <img
                src={`/pieces/${piece.type.replace('P_', 'P-')}.svg`}
                alt={piece.type}
                className={`w-12 h-12 ${piece.owner === Owner.OPPONENT ? 'rotate-180' : ''}`}
            />
        </div>
    )
}