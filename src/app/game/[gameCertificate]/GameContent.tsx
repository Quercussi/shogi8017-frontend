"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { StateTransition } from '@/types/ws-game';
import {
    BoardActionEnumerators,
    GameBoard,
    GameEventWinnerPairDeterminated,
    GameConfiguration,
    Owner,
    Player,
    Position,
    PieceType,
} from '@/types/game';
import { useGameContext } from '@/hooks/useGameWebSocket';
import { opponentPlayer } from '@/app/game/[gameCertificate]/utils/calculations';
import GameOverOverlay from '@/components/GameOverOverlay';
import Sidebar from '@/components/Sidebar';
import MainGameContent from '@/components/MainGameContent';

const initialBoard: GameBoard = Array(9).fill(null).map(() => Array(9).fill(null));

export default function GameContent() {
    const { gameCertificate } = useParams();
    const { data: session } = useSession();
    const [gameState, setGameState] = useState<GameConfiguration>({
        board: initialBoard,
        playerHand: [],
        opponentHand: [],
        currentPlayer: Player.BLACK_PLAYER,
        userColor: null,
        selectedPosition: null,
        selectedHandPiece: null,
    });
    const [gameOutcome, setGameOutcome] = useState<GameEventWinnerPairDeterminated | null>(null);
    const { requestAction, events, setGameCertificate } = useGameContext();
    const router = useRouter();

    useEffect(() => {
        if (Array.isArray(gameCertificate)) {
            setGameCertificate(gameCertificate[0]);
        } else if (typeof gameCertificate === 'string') {
            setGameCertificate(gameCertificate);
        }
    }, [gameCertificate, setGameCertificate]);

    const toBoardIndices = useCallback((position: Position) => ({
        row: 9 - position.y,
        col: 9 - position.x,
    }), []);

    const createPiece = useCallback((pieceType: PieceType, player: Player, userColor: Player | null) => ({
        type: pieceType,
        owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
        ownerPlayer: player,
    }), []);

    useEffect(() => {
        if (!events.boardConfig) return;

        const { playerList, board, handPieceCounts } = events.boardConfig;

        const userColor = playerList.whitePlayer.userId === session?.user?.userInfo.userId
            ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;

        // Initialize board state
        const newBoard = initialBoard.map(row => [...row]);
        board.forEach(({ position, piece, owner: player }) => {
            const { row, col } = toBoardIndices(position);
            newBoard[row][col] = createPiece(piece, player, userColor);
        });

        // Parse hand pieces
        const parseHand = (player: Player) => handPieceCounts
            .filter(hpc => hpc.player === player)
            .flatMap(hpc => Array(hpc.count).fill({
                type: hpc.piece,
                owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
                ownerPlayer: player,
            }));

        setGameState(prev => ({
            ...prev,
            board: newBoard,
            playerHand: parseHand(userColor),
            opponentHand: parseHand(opponentPlayer(userColor)),
            currentPlayer: opponentPlayer(prev.currentPlayer),
            userColor,
        }));

    }, [events.boardConfig, session, toBoardIndices, createPiece]);

    const processTransition = useCallback((transition: StateTransition) => {
        const { boardAction, position, piece, player } = transition;
        const { row, col } = toBoardIndices(position);

        setGameState(prev => {
            const isPlayerPiece = player === prev.userColor;
            const ownerType = isPlayerPiece ? Owner.PLAYER : Owner.OPPONENT;
            const hand = isPlayerPiece ? prev.playerHand : prev.opponentHand;

            switch (boardAction) {
                case BoardActionEnumerators.REMOVE: {
                    const newBoard = [...prev.board];
                    newBoard[row][col] = null;
                    return { ...prev, board: newBoard };
                }

                case BoardActionEnumerators.ADD: {
                    const newBoard = [...prev.board];
                    newBoard[row][col] = createPiece(piece, player, prev.userColor);
                    return { ...prev, board: newBoard };
                }

                case BoardActionEnumerators.HAND_ADD: {
                    const newPiece = createPiece(piece, player, prev.userColor);
                    return isPlayerPiece
                        ? { ...prev, playerHand: [...prev.playerHand, newPiece] }
                        : { ...prev, opponentHand: [...prev.opponentHand, newPiece] };
                }

                case BoardActionEnumerators.HAND_REMOVE: {
                    const index = hand.findIndex(p => p.type === piece);
                    if (index === -1) return prev;

                    const newHand = [...hand.slice(0, index), ...hand.slice(index + 1)];
                    return isPlayerPiece
                        ? { ...prev, playerHand: newHand }
                        : { ...prev, opponentHand: newHand };
                }

                default:
                    return prev;
            }
        });
    }, [toBoardIndices, createPiece]);

    useEffect(() => {
        if (!events.action) return;

        const { stateTransitionList, gameEvent } = events.action;

        stateTransitionList.forEach(processTransition);

        setGameState(prev => ({
            ...prev,
            currentPlayer: prev.currentPlayer === Player.WHITE_PLAYER  ? Player.BLACK_PLAYER : Player.WHITE_PLAYER,
        }));

        if (gameEvent.winner) {
            setGameOutcome({
                gameEvent: gameEvent.gameEvent,
                winner: gameEvent.winner,
            });
        }
    }, [events.action, processTransition]);

    const getDisplayColor = (player: Player) => player === Player.WHITE_PLAYER ? "White" : "Black";
    const userColorDisplay = gameState.userColor ? getDisplayColor(gameState.userColor) : "";
    const currentTurnDisplay = getDisplayColor(gameState.currentPlayer);

    return (
        <div className="h-screen flex">
            <Sidebar
                userColor={userColorDisplay}
                currentTurn={currentTurnDisplay}
                onResign={() => requestAction.resign({})}
            />
            <MainGameContent
                board={gameState.board}
                opponentHand={gameState.opponentHand}
                playerHand={gameState.playerHand}
                currentPlayer={gameState.currentPlayer}
                userColor={gameState.userColor}
            />
            {gameOutcome && (
                <GameOverOverlay
                    outcome={gameOutcome}
                    onReturnHome={() => router.push("/")}
                />
            )}
        </div>
    );
}