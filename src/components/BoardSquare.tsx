"use client";

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { GamePiece, Position } from '@/types/game';
import { useGameContext } from '@/hooks/useGameWebSocket';
import { DragItem, DragItemType, DragItemBoard, DragItemHand } from "@/app/game/[gameCertificate]/utils/drags";
import { BoardPiece } from "@/components/BoardPiece";
import { toast } from "sonner";
import PromotionToast from "@/components/PromotionToast";
import { canPromote, isForcedPromotion } from "@/app/game/[gameCertificate]/utils/calculations";

const BoardSquare = ({ position, piece }: { position: Position, piece: GamePiece | null }) => {
    const { requestAction } = useGameContext();
    const squareRef = useRef<HTMLDivElement>(null);

    const handleBoardPieceDrop = (item: DragItemBoard) => {
        const from = item.position;
        const to = position;
        const pieceType = item.pieceType;
        const player = item.owner;


        if (isForcedPromotion(pieceType, player, to)) {
            requestAction.makeMove({ move: { from, to, toPromote: true } });
        } else if (canPromote(pieceType, player, to)) {
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
        } else {
            requestAction.makeMove({move: {from, to, toPromote: false}});
        }
    };

    const handleHandPieceDrop = (item: DragItemHand) => {
        requestAction.makeDrop({
            drop: {
                position,
                pieceType: item.pieceType
            }
        });
    };

    const [, drop] = useDrop(() => ({
        accept: [DragItemType.BOARD_PIECE, DragItemType.HAND_PIECE],
        drop: (item: DragItem) => {
            toast.dismiss();

            if (item.type === DragItemType.BOARD_PIECE) {
                handleBoardPieceDrop(item as DragItemBoard);
            } else if (item.type === DragItemType.HAND_PIECE) {
                handleHandPieceDrop(item as DragItemHand);
            }
        }
    }), [position, requestAction]);

    drop(squareRef);

    return (
        <div
            ref={squareRef}
            className="w-16 h-16 bg-amber-100 flex items-center justify-center"
        >
            {piece && <BoardPiece position={position} piece={piece} />}
        </div>
    );
};

export default BoardSquare;