"use client";

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { GamePiece, Position } from '@/types/game';
import { useGameContext } from '@/hooks/useGameWebSocket';
import { DragItem, DragItemType } from "@/app/game/[gameCertificate]/utils/drags";
import { BoardPiece } from "@/components/BoardPiece";
import { toast } from "sonner";
import PromotionToast from "@/components/PromotionToast"; // Adjust the path as needed

const BoardSquare = ({ position, piece }: { position: Position, piece: GamePiece | null }) => {
    const { requestAction } = useGameContext();
    const squareRef = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop(() => ({
        accept: [DragItemType.BOARD_PIECE, DragItemType.HAND_PIECE],
        drop: (item: DragItem) => {
            toast.dismiss();

            if (item.type === DragItemType.BOARD_PIECE && item.position) {
                const from = item.position;
                const to = position;

                toast.custom(
                    (t) => (
                        <PromotionToast
                            move={{ from, to }}
                            makeMove={requestAction.makeMove}
                            dismissToast={() => toast.dismiss(t)}
                        />
                    ),
                    { duration: Infinity }
                );
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
    }), [position, requestAction]);

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