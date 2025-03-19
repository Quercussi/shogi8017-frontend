"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    GameBoard,
    GameConfiguration,
    GameEventWinnerPairDeterminated,
    Player,
    MoveResultReduced
} from '@/types/game';
import {
    commitStateTransition,
    reverseStateTransitionList,
    createPiece,
    toBoardIndices
} from '@/app/game/[gameCertificate]/utils/calculations';
import ViewSidebar from '@/components/ViewSidebar';
import MainGameContent from '@/components/MainGameContent';
import { paginatedGetHistory, getDefaultConfiguration } from '@/actions/game';

const initialBoard: GameBoard = Array(9).fill(null).map(() => Array(9).fill(null));

export default function GameViewContent() {
    const { gameCertificate } = useParams();
    const [gameState, setGameState] = useState<GameConfiguration>({
        board: initialBoard,
        whiteHand: [],
        blackHand: [],
        currentPlayer: Player.BLACK_PLAYER,
        userColor: Player.BLACK_PLAYER, // Default viewing perspective
        selectedPosition: null,
        selectedHandPiece: null,
    });
    const [gameOutcome, setGameOutcome] = useState<GameEventWinnerPairDeterminated | null>(null);
    const [moveHistory, setMoveHistory] = useState<MoveResultReduced[]>([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    // Initialize board with default configuration
    useEffect(() => {
        const initializeBoard = async () => {
            try {
                const configResponse = await getDefaultConfiguration();

                if (configResponse.success) {
                    const { board, handPieceCounts, currentPlayerTurn } = configResponse.value;

                    // Initialize board state
                    const newBoard = initialBoard.map(row => [...row]);
                    board.forEach(({ position, piece, owner: player }) => {
                        const { row, col } = toBoardIndices(position);
                        newBoard[row][col] = createPiece(piece, player);
                    });

                    // Parse hand pieces (initially empty)
                    const parseHand = (player: Player) => handPieceCounts
                        .filter(hpc => hpc.player === player)
                        .flatMap(hpc => Array(hpc.count).fill({
                            type: hpc.piece,
                            owner: player,
                        }));

                    setGameState(prev => ({
                        ...prev,
                        board: newBoard,
                        whiteHand: parseHand(Player.WHITE_PLAYER),
                        blackHand: parseHand(Player.BLACK_PLAYER),
                        currentPlayer: currentPlayerTurn
                    }));
                }
            } catch (error) {
                console.error("Failed to initialize default board:", error);
            }
        };

        initializeBoard();
    }, []);

    // Fetch game history
    useEffect(() => {
        const fetchGameHistory = async () => {
            if (!gameCertificate) return;

            const certString = Array.isArray(gameCertificate) ? gameCertificate[0] : gameCertificate;
            setIsLoading(true);
            setError(null);

            try {
                // Fetch move history
                const response = await paginatedGetHistory({
                    gameCertificate: certString,
                    limit: 100 // Fetch a large number of moves
                });

                if (response.success) {
                    setMoveHistory(response.value.executionHistories);

                    // If there's a winner in the last move, set it as game outcome
                    const lastMove = response.value.executionHistories[response.value.executionHistories.length - 1];
                    if (lastMove?.gameEventWinnerPair?.winner) {
                        setGameOutcome({
                            gameEvent: lastMove.gameEventWinnerPair.gameEvent,
                            winner: lastMove.gameEventWinnerPair.winner
                        });
                    }
                } else {
                    setError(response.error || "Failed to fetch game history");
                }
            } catch (error) {
                setError("An unexpected error occurred");
                console.error("Failed to fetch game history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameHistory();
    }, [gameCertificate]);

    // Apply a move by executing its state transitions
    const applyMove = useCallback((move: MoveResultReduced) => {
        setGameState(prevState => {
            // Apply all transitions in the move
            const updatedState = move.stateTransitionList.reduce(
                (state, transition) => commitStateTransition(state, transition),
                prevState
            );

            return {
                ...updatedState,
                currentPlayer: move.player === Player.WHITE_PLAYER
                    ? Player.BLACK_PLAYER : Player.WHITE_PLAYER
            };
        });
    }, []);

    const undoMove = useCallback((move: MoveResultReduced) => {
        setGameState(prevState => {
            const reversedTransitions = reverseStateTransitionList(move.stateTransitionList);

            const updatedState = reversedTransitions.reduce(
                (state, transition) => commitStateTransition(state, transition),
                prevState
            );

            return {
                ...updatedState,
                currentPlayer: move.player
            };
        });
    }, []);

    // Handle move navigation
    const goToNextMove = useCallback(() => {
        if (currentMoveIndex < moveHistory.length - 1) {
            const nextIndex = currentMoveIndex + 1;
            applyMove(moveHistory[nextIndex]);
            setCurrentMoveIndex(nextIndex);
        }
    }, [currentMoveIndex, moveHistory, applyMove]);

    const goToPrevMove = useCallback(() => {
        if (currentMoveIndex >= 0) {
            const prevMove = moveHistory[currentMoveIndex];
            undoMove(prevMove);
            setCurrentMoveIndex(currentMoveIndex - 1);
        }
    }, [currentMoveIndex, moveHistory, undoMove]);

    // Change view perspective
    const togglePerspective = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            userColor: prev.userColor === Player.WHITE_PLAYER
                ? Player.BLACK_PLAYER : Player.WHITE_PLAYER
        }));
    }, []);

    // Display helpers
    const getDisplayColor = (player: Player) => player === Player.WHITE_PLAYER ? "White" : "Black";
    const userColorDisplay = gameState.userColor ? getDisplayColor(gameState.userColor) : "";
    const currentTurnDisplay = getDisplayColor(gameState.currentPlayer);

    // Determine which hands to show
    const playerHand = gameState.userColor === Player.WHITE_PLAYER
        ? gameState.whiteHand : gameState.blackHand;
    const opponentHand = gameState.userColor === Player.WHITE_PLAYER
        ? gameState.blackHand : gameState.whiteHand;

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Loading game history...</div>;
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex">
            <ViewSidebar
                userColor={userColorDisplay}
                currentTurn={currentTurnDisplay}
                currentMoveIndex={currentMoveIndex}
                totalMoves={moveHistory.length}
                currentNotation={currentMoveIndex >= 0 ? moveHistory[currentMoveIndex].algebraicNotation : ""}
                onNext={goToNextMove}
                onPrevious={goToPrevMove}
                onTogglePerspective={togglePerspective}
                onReturnHome={() => router.push("/")}
            />
            <MainGameContent
                board={gameState.board}
                opponentHand={opponentHand}
                playerHand={playerHand}
                currentPlayer={gameState.currentPlayer}
                userColor={gameState.userColor}
                viewOnly={true}
            />
            {/*{gameOutcome && (*/}
            {/*    <GameOverOverlay*/}
            {/*        outcome={gameOutcome}*/}
            {/*        onReturnHome={() => router.push("/")}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}