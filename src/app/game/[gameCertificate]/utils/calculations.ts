import {PieceType, Player, Position, PromotablePieceType, PromotedPieceType, UnPromotablePieceType} from "@/types/game";

const promotedPiecesSet = new Set(Object.values(PromotedPieceType) as PromotedPieceType[]);
const unpromotablePiecesSet = new Set(Object.values(UnPromotablePieceType) as UnPromotablePieceType[]);

function opponentPlayer(player: Player): Player {
    return player === Player.WHITE_PLAYER ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
}

function isPromotablePiece(pieceType: PieceType): boolean {
    return !unpromotablePiecesSet.has(pieceType as UnPromotablePieceType) && !promotedPiecesSet.has(pieceType as PromotedPieceType);
}

function canPromote(pieceType: PieceType, player: Player, toPosition: Position): boolean {
    const isInPromotionZone = player === Player.WHITE_PLAYER ? toPosition.y >= 7 : toPosition.y <= 3;

    return isPromotablePiece(pieceType) && isInPromotionZone;
}

function isForcedPromotion(pieceType: PieceType, player: Player, toPosition: Position): boolean {
    if(!isPromotablePiece(pieceType)) {
        return false;
    } else {
        switch (pieceType) {
            case PromotablePieceType.PAWN:
            case PromotablePieceType.LANCE:
                return player === Player.WHITE_PLAYER ? toPosition.y === 9 : toPosition.y === 1;
            case PromotablePieceType.KNIGHT:
                return player === Player.WHITE_PLAYER ? toPosition.y >= 8 : toPosition.y <= 2;
            default:
                return false;
        }
    }
}

export {
    opponentPlayer,
    isPromotablePiece,
    canPromote,
    isForcedPromotion
}