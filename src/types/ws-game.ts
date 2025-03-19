import * as GameTypes from "@/types/game";

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
    playerList: GameTypes.PlayerList,
    board: GameTypes.PositionPiecePair[],
    handPieceCounts: GameTypes.HandPieceCount[],
    currentPlayerTurn: GameTypes.Player,
}

type ExecutionActionEvent = BaseWebSocketEvent<'ExecutionAction', ExecutionActionEventPayload>

type ExecutionActionEventPayload = {
    stateTransitionList: GameTypes.StateTransition[],
    gameEvent: GameTypes.GameEventWinnerPair,
}

type InvalidGameActionEvent = BaseWebSocketEvent<'InvalidGameAction', InvalidGameActionPayload>

type InvalidGameActionPayload = {
    errorMessage: string
}


type MakeMoveRequest = BaseWebSocketRequest<'makeMove', MakeMoveRequestPayload>

type MakeMoveRequestPayload = {
    move: GameTypes.MoveAction
}


type MakeDropRequest = BaseWebSocketRequest<'makeDrop', MakeDropRequestPayload>

type MakeDropRequestPayload = {
    drop: GameTypes.DropAction
}


type ResignRequest = BaseWebSocketRequest<'resign', ResignRequestPayload>

type ResignRequestPayload = {}


export type {
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