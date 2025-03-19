import {
    BoardActionEnumerators,
    GameConfiguration,
    PieceType,
    Player,
    Position,
    PromotablePieceType,
    PromotedPieceType,
    StateTransition,
    UnPromotablePieceType
} from "@/types/game";

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

function toBoardIndices(position: Position): BoardIndices {
    return {
        row: 9 - position.y,
        col: 9 - position.x,
    }
}

function createPiece(pieceType: PieceType, owner: Player) {
    return {
        type: pieceType,
        owner,
    }
}

function commitStateTransition(prev: GameConfiguration, transition: StateTransition): GameConfiguration {
    const { boardAction, position, piece, player } = transition;
    const { row, col } = toBoardIndices(position);

    switch (boardAction) {
        case BoardActionEnumerators.REMOVE: {
            const newBoard = [...prev.board];
            newBoard[row][col] = null;
            return { ...prev, board: newBoard };
        }

        case BoardActionEnumerators.ADD: {
            const newBoard = [...prev.board];
            newBoard[row][col] = createPiece(piece, player)
            return { ...prev, board: newBoard };
        }

        case BoardActionEnumerators.HAND_ADD: {
            const newPiece = createPiece(piece, player);
            return player == Player.WHITE_PLAYER
                ? { ...prev, whiteHand: [...prev.whiteHand, newPiece] }
                : { ...prev, blackHand: [...prev.blackHand, newPiece] };
        }

        case BoardActionEnumerators.HAND_REMOVE: {
            const hand = player === Player.WHITE_PLAYER ? prev.whiteHand : prev.blackHand;
            const index = hand.findIndex(p => p.type === piece);
            console.log(`removing ${piece} from ${player}'s hand`)
            if (index === -1) return prev;

            const newHand = [...hand.slice(0, index), ...hand.slice(index + 1)];
            return player == Player.WHITE_PLAYER
                ? { ...prev, whiteHand: newHand }
                : { ...prev, blackHand: newHand };
        }

        default:
            return prev;
    }
}

function reverseStateTransitionList(transitionList: StateTransition[]): StateTransition[] {
    const reversedList = [...transitionList].reverse();
    return reversedList.map((state: StateTransition) => {
        switch (state.boardAction) {
            case BoardActionEnumerators.ADD:
                return { ...state, boardAction: BoardActionEnumerators.REMOVE };
            case BoardActionEnumerators.REMOVE:
                return { ...state, boardAction: BoardActionEnumerators.ADD };
            case BoardActionEnumerators.HAND_ADD:
                return { ...state, boardAction: BoardActionEnumerators.HAND_REMOVE };
            case BoardActionEnumerators.HAND_REMOVE:
                return { ...state, boardAction: BoardActionEnumerators.HAND_ADD };
        }
    })
}

export {
    opponentPlayer,
    isPromotablePiece,
    canPromote,
    isForcedPromotion,
    toBoardIndices,
    createPiece,
    commitStateTransition,
    reverseStateTransitionList
}