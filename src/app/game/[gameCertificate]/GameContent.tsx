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
    }, [gameCertificate]);

    // Convert server position to board indices
    const toBoardIndices = useCallback((position: Position) => ({
        row: 9 - position.y,
        col: 9 - position.x,
    }), []);

    // Handle board configuration updates
    useEffect(() => {
        if (!events.boardConfig) return;

        const { playerList, board, handPieceCounts } = events.boardConfig;

        const userColor =
            playerList.whitePlayer.userId === session?.user?.userInfo.userId
                ? Player.WHITE_PLAYER
                : Player.BLACK_PLAYER;

        // Initialize board state
        const newBoard = initialBoard.map((row) => [...row]); // cloning
        board.forEach(({ position, piece, owner: player }) => {
            const { row, col } = toBoardIndices(position);
            newBoard[row][col] = {
                type: piece,
                owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
            };
        });

        // Initialize hands
        const parseHand = (player: Player | null) =>
            handPieceCounts
                .filter((hpc) => hpc.player === player)
                .flatMap((hpc) =>
                    Array(hpc.count).fill({
                        type: hpc.piece,
                        owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
                        promoted: false,
                    })
                );

        setGameState((prev) => ({
            ...prev,
            board: newBoard,
            playerHand: parseHand(userColor),
            opponentHand: parseHand(opponentPlayer(userColor)),
            currentPlayer: opponentPlayer(prev.currentPlayer),
            userColor: userColor,
        }));

        console.log("Board Configuration Updated", gameState);
    }, [events.boardConfig]);

    // Handle game actions
    useEffect(() => {
        if (!events.action) return;

        const processTransition = (transition: StateTransition) => {
            const { row, col } = toBoardIndices(transition.position);

            switch (transition.boardAction) {
                case BoardActionEnumerators.REMOVE:
                    setGameState((prev) => {
                        const newBoard = [...prev.board];
                        newBoard[row][col] = null;
                        return { ...prev, board: newBoard };
                    });
                    break;

                case BoardActionEnumerators.ADD:
                    setGameState((prev) => {
                        const newBoard = [...prev.board];
                        newBoard[row][col] = {
                            type: transition.piece,
                            owner: transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT,
                        };
                        return { ...prev, board: newBoard };
                    });
                    break;

                case BoardActionEnumerators.HAND_ADD:
                    setGameState((prev) => {
                        const player = transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT;
                        const newPiece = {
                            type: transition.piece,
                            owner: player,
                        };

                        return player === Owner.PLAYER
                            ? { ...prev, playerHand: [...prev.playerHand, newPiece] }
                            : { ...prev, opponentHand: [...prev.opponentHand, newPiece] };
                    });
                    break;

                case BoardActionEnumerators.HAND_REMOVE:
                    setGameState((prev) => {
                        const player = transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT;
                        const hand = player === Owner.PLAYER ? prev.playerHand : prev.opponentHand;

                        // Find first matching piece to remove
                        const index = hand.findIndex((p) => p.type === transition.piece);
                        if (index === -1) return prev; // No match found

                        const newHand = [...hand.slice(0, index), ...hand.slice(index + 1)];

                        return player === Owner.PLAYER
                            ? { ...prev, playerHand: newHand }
                            : { ...prev, opponentHand: newHand };
                    });
                    break;
            }
        };

        const { stateTransitionList, gameEvent } = events.action;

        stateTransitionList.forEach(processTransition);
        setGameState((prev) => ({
            ...prev,
            currentPlayer: prev.currentPlayer === Player.WHITE_PLAYER ? Player.BLACK_PLAYER : Player.WHITE_PLAYER,
        }));

        if (gameEvent.winner) {
            setGameOutcome({
                gameEvent: gameEvent.gameEvent,
                winner: gameEvent.winner,
            });
        }
    }, [events.action]);

    return (
        <div className="h-screen flex">
            <Sidebar
                userColor={
                    gameState.userColor
                        ? gameState.userColor === Player.WHITE_PLAYER
                            ? "White"
                            : "Black"
                        : ""
                }
                currentTurn={gameState.currentPlayer === Player.WHITE_PLAYER ? "White" : "Black"}
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
