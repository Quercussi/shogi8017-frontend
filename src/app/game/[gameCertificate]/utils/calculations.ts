import {PieceType, Player, PromotedPieceType} from "@/types/game";

const promotedPiecesSet = new Set(Object.values(PromotedPieceType) as PromotedPieceType[]);

function isPromotedPiece(pieceType: PieceType): boolean {
    return promotedPiecesSet.has(pieceType as PromotedPieceType);
}

function opponentPlayer(player: Player): Player {
    return player === Player.WHITE_PLAYER ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
}

export {
    isPromotedPiece,
    opponentPlayer
}