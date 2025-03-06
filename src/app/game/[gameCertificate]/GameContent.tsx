"use client"

import React, {useCallback, useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation"
import {useSession} from 'next-auth/react'
import {StateTransition} from "@/types/ws-game";
import {
    BoardActionEnumerators,
    GameBoard,
    GameEventWinnerPairDeterminated,
    GameState,
    Owner,
    Player,
    Position
} from "@/types/game";
import {useGameContext} from "@/hooks/useGameWebSocket";
import {isPromotedPiece, opponentPlayer} from "@/app/game/[gameCertificate]/utils/calculations";
import HandPiece from "@/components/HandPiece";
import GameBoardComponent from "@/components/GameBoardComponent";
import GameOverOverlay from "@/components/GameOverOverlay";

const initialBoard: GameBoard = Array(9).fill(null).map(() => Array(9).fill(null))

export default function GameContent() {
    const { gameCertificate } = useParams()
    const { data: session } = useSession()
    const [gameState, setGameState] = useState<GameState>({
        board: initialBoard,
        playerHand: [],
        opponentHand: [],
        currentPlayer: Player.BLACK_PLAYER,
        userColor: null,
        selectedPosition: null,
        selectedHandPiece: null
    })
    const [gameOutcome, setGameOutcome] = useState<GameEventWinnerPairDeterminated | null>(null)

    const { requestAction, events, setGameCertificate } = useGameContext()

    const router = useRouter()

    useEffect(() => {
        if (Array.isArray(gameCertificate)) {
            setGameCertificate(gameCertificate[0])
        } else if (typeof gameCertificate === 'string') {
            setGameCertificate(gameCertificate)
        }
    }, [gameCertificate]);

    // Convert server position to board indices
    const toBoardIndices = useCallback((position: Position) => ({
        row: 9 - position.y,
        col: position.x - 1
    }), [])

    // Handle board configuration updates
    useEffect(() => {
        if (!events.boardConfig) return

        const { playerList, board, handPieceCounts } = events.boardConfig

        const userColor = playerList.whitePlayer.userId === session?.user?.userInfo.userId ?
            Player.WHITE_PLAYER :
            Player.BLACK_PLAYER

        // Initialize board state
        const newBoard = initialBoard.map(row => [...row]) // cloning
        board.forEach(({ position, piece, owner: player }) => {
            const { row, col } = toBoardIndices(position)
            newBoard[row][col] = {
                type: piece,
                owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
            }
        })

        // Initialize hands
        const parseHand = (player: Player | null) =>
            handPieceCounts
                .filter(hpc => hpc.player === player)
                .flatMap(hpc =>
                    Array(hpc.count).fill({
                        type: hpc.piece,
                        owner: player === userColor ? Owner.PLAYER : Owner.OPPONENT,
                        promoted: false
                    })
                )

        setGameState(prev => ({
            ...prev,
            board: newBoard,
            playerHand: parseHand(userColor),
            opponentHand: parseHand(opponentPlayer(userColor)),
            currentPlayer: opponentPlayer(prev.currentPlayer),
            userColor: userColor,
        }))
    }, [events.boardConfig])

    // Handle game actions
    useEffect(() => {
        if (!events.action) return

        const processTransition = (transition: StateTransition) => {
            const { row, col } = toBoardIndices(transition.position)

            switch (transition.boardAction) {
                case BoardActionEnumerators.REMOVE:
                    setGameState(prev => {
                        const newBoard = [...prev.board]
                        newBoard[row][col] = null
                        return { ...prev, board: newBoard }
                    })
                    break

                case BoardActionEnumerators.ADD:
                    setGameState(prev => {
                        const newBoard = [...prev.board]
                        newBoard[row][col] = {
                            type: transition.piece,
                            owner: transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT,
                        }
                        return { ...prev, board: newBoard }
                    })
                    break

                case BoardActionEnumerators.HAND_ADD:
                    setGameState(prev => {
                        const player = transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT
                        const newPiece = {
                            type: transition.piece,
                            owner: player,
                        }

                        return player === Owner.PLAYER ?
                            { ...prev, playerHand: [...prev.playerHand, newPiece] } :
                            { ...prev, opponentHand: [...prev.opponentHand, newPiece] }
                    })
                    break

                case BoardActionEnumerators.HAND_REMOVE:
                    setGameState(prev => {
                        const player = transition.player === prev.userColor ? Owner.PLAYER : Owner.OPPONENT
                        const hand = player === Owner.PLAYER ? prev.playerHand : prev.opponentHand

                        // Find first matching piece to remove
                        const index = hand.findIndex(p => p.type === transition.piece)
                        if (index === -1) return prev // No match found

                        const newHand = [...hand.slice(0, index), ...hand.slice(index + 1)]

                        return player === Owner.PLAYER
                            ? { ...prev, playerHand: newHand }
                            : { ...prev, opponentHand: newHand }
                    })
                    break
            }
        }

        const { stateTransitionList, gameEvent } = events.action

        stateTransitionList.forEach(processTransition)
        setGameState(prev => ({
            ...prev,
            currentPlayer: prev.currentPlayer === Player.WHITE_PLAYER
                ? Player.BLACK_PLAYER
                : Player.WHITE_PLAYER
        }))

        if (gameEvent.winner) {
            setGameOutcome({
                gameEvent: gameEvent.gameEvent,
                winner: gameEvent.winner
            })
        }
    }, [events.action])

    // const [count, setCount] = useState(0)
    //
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCount(prevCount => prevCount + 1);
    //     }, 1000);
    //
    //     return () => clearInterval(intervalId);
    // }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {gameOutcome && (
                <GameOverOverlay
                    outcome={gameOutcome}
                    onReturnHome={() => router.push("/")}
                />
            )}

            <div className="flex flex-col items-center p-4 gap-4">
                {/* Game Controls */}
                <div className="w-full max-w-2xl flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {gameState.userColor === Player.WHITE_PLAYER ? 'White' : 'Black'} Player
                    </h2>
                    <button
                        onClick={() => requestAction.resign({})}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Resign
                    </button>
                </div>

                {/* Opponent Hand */}
                <div className="w-full max-w-2xl grid grid-cols-9 gap-2">
                    {gameState.opponentHand.map((piece, index) => (
                        <div key={index} className="h-12 flex items-center justify-center">
                            <HandPiece piece={piece} />
                        </div>
                    ))}
                </div>

                {/* Game Board */}
                <GameBoardComponent
                    board={gameState.board}
                    currentPlayer={gameState.currentPlayer}
                    userColor={gameState.userColor}
                />

                {/* Player Hand */}
                <div className="w-full max-w-2xl grid grid-cols-9 gap-2">
                    {gameState.playerHand.map((piece, index) => (
                        <div key={index} className="h-12 flex items-center justify-center">
                            <HandPiece piece={piece} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}