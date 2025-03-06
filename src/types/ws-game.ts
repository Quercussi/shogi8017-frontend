import {UserModel} from "@/types/user";
import {
    BoardActionEnumerators,
    DropAction,
    GameEvent,
    GameWinner,
    MoveAction,
    PieceType,
    Player,
    Position
} from "@/types/game";


type GameActionRequest =
    | MakeMoveRequest
    | MakeDropRequest
    | ResignRequest

type GameActionEvent =
    | BoardConfigurationEvent
    | ExecutionActionEvent
    | InvalidGameActionEvent


type BoardConfigurationEvent  = BaseWebSocketEvent<'BoardConfiguration', BoardConfigurationEventPayload>

type BoardConfigurationEventPayload = {
    playerList: PlayerList,
    board: PositionPiecePair[],
    handPieceCounts: HandPieceCount[]
}

type PlayerList = {
    whitePlayer: UserModel
    blackPlayer: UserModel
}

type PositionPiecePair = {
    position: Position,
    piece: PieceType,
    owner: Player,
}

type HandPieceCount = {
    player: Player,
    piece: PieceType,
    count: number
}


type ExecutionActionEvent = BaseWebSocketEvent<'ExecutionAction', ExecutionActionEventPayload>

type ExecutionActionEventPayload = {
    stateTransitionList: StateTransition[],
    gameEvent: GameEventWinnerPair,
}

type StateTransition = {
    boardAction: BoardActionEnumerators,
    position: Position,
    player: Player,
    piece: PieceType
}

type GameEventWinnerPair = {
    gameEvent?: GameEvent,
    winner?: GameWinner
}


type InvalidGameActionEvent = BaseWebSocketEvent<'InvalidGameAction', InvalidGameActionPayload>

type InvalidGameActionPayload = {
    errorMessage: string
}


type MakeMoveRequest = BaseWebSocketRequest<'makeMove', MakeMoveRequestPayload>

type MakeMoveRequestPayload = {
    move: MoveAction
}


type MakeDropRequest = BaseWebSocketRequest<'makeDrop', MakeDropRequestPayload>

type MakeDropRequestPayload = {
    drop: DropAction
}


type ResignRequest = BaseWebSocketRequest<'resign', ResignRequestPayload>

type ResignRequestPayload = {}


export type {
    StateTransition,

    GameActionRequest,
    MakeMoveRequest,
    MakeDropRequest,
    ResignRequest,

    MakeMoveRequestPayload,
    MakeDropRequestPayload,
    ResignRequestPayload,

    GameActionEvent,
    BoardConfigurationEvent,
    ExecutionActionEvent,
    InvalidGameActionEvent,

    BoardConfigurationEventPayload,
    ExecutionActionEventPayload,
    InvalidGameActionPayload,
}