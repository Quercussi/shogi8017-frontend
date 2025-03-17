import {PieceType, Player, Position} from "@/types/game";

type DragItem =
    | DragItemHand
    | DragItemBoard

type DragItemHand = {
    type: DragItemType.HAND_PIECE,
    pieceType: PieceType
}

type DragItemBoard = {
    type: DragItemType.BOARD_PIECE,
    position: Position,
    pieceType: PieceType,
    owner: Player
}

enum DragItemType {
    HAND_PIECE = 'HAND_PIECE',
    BOARD_PIECE = 'BOARD_PIECE'
}


export type {
    DragItem,
    DragItemHand,
    DragItemBoard
}

export {
    DragItemType
}