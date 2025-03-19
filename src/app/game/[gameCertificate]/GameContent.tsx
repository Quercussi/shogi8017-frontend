"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    GameBoard,
    GameConfiguration,
    GameEventWinnerPairDeterminated,
    Player,
} from '@/types/game';
import { useGameContext } from '@/hooks/useGameWebSocket';
import {
    commitStateTransition,
    createPiece,
    opponentPlayer,
    toBoardIndices
} from '@/app/game/[gameCertificate]/utils/calculations';
import GameOverOverlay from '@/components/GameOverOverlay';
import Sidebar from '@/components/Sidebar';
import MainGameContent from '@/components/MainGameContent';
import { useSession } from "next-auth/react";

const initialBoard: GameBoard = Array(9).fill(null).map(() => Array(9).fill(null));

export default function GameContent() {
    const { gameCertificate } = useParams();
    const { data: session } = useSession();
    const [gameState, setGameState] = useState<GameConfiguration>({
        board: initialBoard,
        whiteHand: [],
        blackHand: [],
        currentPlayer: Player.BLACK_PLAYER,
        userColor: null,
        selectedPosition: null,
        selectedHandPiece: null,
    });
    const [gameOutcome, setGameOutcome] = useState<GameEventWinnerPairDeterminated | null>(null);
    const { requestAction, events, setGameCertificate } = useGameContext();
    const router = useRouter();

    // Initialize game certificate
    useEffect(() => {
        const cert = Array.isArray(gameCertificate) ? gameCertificate[0] : gameCertificate;
        if (typeof cert === 'string') {
            setGameCertificate(cert);
        }
    }, [gameCertificate, setGameCertificate]);

    // Handle board configuration updates
    useEffect(() => {
        if (!events.boardConfig) return;

        const { playerList, board, handPieceCounts, currentPlayerTurn } = events.boardConfig;
        const userColor = playerList.whitePlayer.userId === session?.user?.userInfo.userId
            ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;

        // Initialize board state
        const newBoard = initialBoard.map(row => [...row]);
        board.forEach(({ position, piece, owner: player }) => {
            const { row, col } = toBoardIndices(position);
            newBoard[row][col] = createPiece(piece, player);
        });

        // Parse hand pieces
        const parseHand = (player: Player) => handPieceCounts
            .filter(hpc => hpc.player === player)
            .flatMap(hpc => Array(hpc.count).fill({
                type: hpc.piece,
                owner: player,
                ownerPlayer: player,
            }));

        setGameState(prev => ({
            ...prev,
            board: newBoard,
            whiteHand: parseHand(Player.WHITE_PLAYER),
            blackHand: parseHand(Player.BLACK_PLAYER),
            currentPlayer: currentPlayerTurn, // Use the current player from payload
            userColor,
        }));
    }, [events.boardConfig, session?.user?.userInfo.userId]);

    // Handle game actions
    useEffect(() => {
        if (!events.action) return;

        const { stateTransitionList, gameEvent } = events.action;

        setGameState(prevState => {
            const updatedState = stateTransitionList.reduce(
                (state, transition) => commitStateTransition(state, transition),
                prevState
            );

            return {
                ...updatedState,
                currentPlayer: opponentPlayer(updatedState.currentPlayer),
            };
        });

        if (gameEvent.winner) {
            setGameOutcome({
                gameEvent: gameEvent.gameEvent,
                winner: gameEvent.winner,
            });
        }
    }, [events.action]);

    const getDisplayColor = (player: Player) => player === Player.WHITE_PLAYER ? "White" : "Black";
    const userColorDisplay = gameState.userColor ? getDisplayColor(gameState.userColor) : "";
    const currentTurnDisplay = getDisplayColor(gameState.currentPlayer);

    const [playerHand, opponentHand] = gameState.userColor === Player.WHITE_PLAYER
        ? [gameState.whiteHand, gameState.blackHand]
        : [gameState.blackHand, gameState.whiteHand];

    return (
        <div className="h-screen flex">
            <Sidebar
                userColor={userColorDisplay}
                currentTurn={currentTurnDisplay}
                onResign={() => requestAction.resign({})}
                gameOutcome={gameOutcome}
                onReturnHome={() => router.push("/")}
            />
            <MainGameContent
                board={gameState.board}
                opponentHand={opponentHand}
                playerHand={playerHand}
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