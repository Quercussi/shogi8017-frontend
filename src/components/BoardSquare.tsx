"use client";

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { GamePiece, Player, Position } from '@/types/game';
import { useGameContext } from '@/hooks/useGameWebSocket';
import { DragItem, DragItemType, DragItemBoard, DragItemHand } from "@/app/game/[gameCertificate]/utils/drags";
import { BoardPiece } from "@/components/BoardPiece";
import { toast } from "sonner";
import PromotionToast from "@/components/PromotionToast";
import { canPromote, isForcedPromotion } from "@/app/game/[gameCertificate]/utils/calculations";
import { Maybe } from "@/types/type-constructor";

interface BoardSquareProps {
    userColor: Maybe<Player>;
    position: Position;
    piece: Maybe<GamePiece>;
    viewOnly?: boolean;
}

function StaticBoardSquare({ userColor, position, piece }: Omit<BoardSquareProps, 'viewOnly'>) {
    return (
        <div className="w-16 h-16 bg-amber-100 flex items-center justify-center">
            {piece && <BoardPiece
                userColor={userColor}
                position={position}
                piece={piece}
                viewOnly={true}
            />}
        </div>
    );
}

function InteractiveBoardSquare({ userColor, position, piece }: Omit<BoardSquareProps, 'viewOnly'>) {
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
            {piece && <BoardPiece
                userColor={userColor}
                position={position}
                piece={piece}
                viewOnly={false}
            />}
        </div>
    );
}

const BoardSquare = (props: BoardSquareProps) => {
    const { viewOnly = false } = props;

    if (viewOnly) {
        return <StaticBoardSquare {...props} />;
    }

    return <InteractiveBoardSquare {...props} />;
};

export default BoardSquare;