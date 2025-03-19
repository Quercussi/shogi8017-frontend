"use client"

import {useCallback, useMemo} from 'react'
import {Position, GameBoard, Player} from '@/types/game'
import BoardSquare from "@/components/BoardSquare";
import {Maybe} from "@/types/type-constructor";

interface GameBoardProps {
    board: GameBoard
    currentPlayer: Player
    userColor: Maybe<Player>
}

const GameBoardComponent = ({ board, userColor }: GameBoardProps) => {
    const renderSquare = useCallback((x: number, y: number) => {
        const position: Position = { x, y }
        const row = 9 - y
        const col = 9 - x
        const piece = board[row][col]

        return (
            <BoardSquare
                key={`${x}-${y}`}
                position={position}
                piece={piece}
            />
        )
    }, [board])

    const squares = useMemo(() => {
        const baseSquares = Array.from({ length: 9 })
            .map((_, y) => Array.from({ length: 9 })
                .map((__, x) => renderSquare(x + 1, y + 1))
            )

        if (userColor === Player.WHITE_PLAYER) {
            baseSquares.reverse()
        } else {
            baseSquares.forEach(row => row.reverse())
        }

        return baseSquares
    }, [renderSquare, userColor])

    return (
        <div className="grid grid-cols-9 gap-px bg-gray-800">
            {squares}
        </div>
    )
}

export default GameBoardComponent