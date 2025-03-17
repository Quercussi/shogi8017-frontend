type TGamePaginatedGetPayload = {
    offset?: number
    limit?: number
}

type TGamePaginatedGetResponse = {
    games: GameModel[],
    count: number,
    nextOffset: number,
    total: number
}

type GameModel = {
    gameId: String,
    gameCertificate: String,
    boardId: String,
    whiteUserId: String,
    blackUserId: String,
    winner?: GameWinner,
    gameState: GameState,
    createdAt: number,
}

type Position = {
    x: number;
    y: number;
}

enum Player {
    WHITE_PLAYER = 'WHITE_PLAYER',
    BLACK_PLAYER = 'BLACK_PLAYER'
}

enum BoardActionEnumerators {
    REMOVE = 'REMOVE',
    ADD = 'ADD',
    HAND_ADD = 'HAND_ADD',
    HAND_REMOVE = 'HAND_REMOVE'
}

type MoveAction = {
    from: Position,
    to: Position,
    toPromote: boolean,
}

type DropAction = {
    position: Position,
    pieceType: PieceType
}

type PieceType = PromotablePieceType | PromotedPieceType | UnPromotablePieceType

enum PromotablePieceType {
    ROOK = 'ROOK',
    BISHOP = 'BISHOP',
    LANCE = 'LANCE',
    KNIGHT = 'KNIGHT',
    SILVER = 'SILVER',
    PAWN = 'PAWN'
}

enum PromotedPieceType {
    P_ROOK = 'P_ROOK',
    P_BISHOP = 'P_BISHOP',
    P_LANCE = 'P_LANCE',
    P_KNIGHT = 'P_KNIGHT',
    P_SILVER = 'P_SILVER',
    P_PAWN = 'P_PAWN'
}

enum UnPromotablePieceType {
    KING = 'KING',
    GOLD = 'GOLD'
}

enum GameEvent {
    CHECK = 'CHECK',
    STALEMATE = 'STALEMATE',
    IMPASSE = 'IMPASSE',
    CHECKMATE = 'CHECKMATE',
    RESIGNATION = 'RESIGNATION'
}

enum GameWinner {
    WHITE_WINNER = 'WHITE_WINNER',
    BLACK_WINNER = 'BLACK_WINNER',
    DRAW = 'DRAW'
}

enum GameState {
    PENDING = 'PENDING',
    ON_GOING = 'ON_GOING',
    FINISHED = 'FINISHED'
}


type GamePiece = {
    type: PieceType
    owner: Owner
    ownerPlayer: Player
}

enum Owner {
    PLAYER = 'PLAYER',
    OPPONENT = 'OPPONENT'
}

type GameBoard = (GamePiece | null)[][]

type GameHand = GamePiece[]

type GameConfiguration = {
    board: GameBoard
    playerHand: GameHand
    opponentHand: GameHand
    currentPlayer: Player
    userColor: Player | null
    selectedPosition: Position | null
    selectedHandPiece: PieceType | null
}

type GameEventWinnerPairDeterminated = {
    gameEvent?: GameEvent,
    winner: GameWinner
}

export type {
    TGamePaginatedGetPayload,
    TGamePaginatedGetResponse,

    GameModel,
    Position,
    MoveAction,
    DropAction,
    PieceType,
    GameEventWinnerPairDeterminated,

    GamePiece,
    GameBoard,
    GameHand,
    GameConfiguration
}

export {
    GameState,
    BoardActionEnumerators,
    Player,
    PromotablePieceType,
    PromotedPieceType,
    UnPromotablePieceType,
    GameEvent,
    GameWinner,

    Owner,
}