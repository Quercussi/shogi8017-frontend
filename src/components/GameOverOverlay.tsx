import {GameEvent, GameEventWinnerPairDeterminated, GameWinner} from "@/types/game";

const GameOverOverlay = ({
    outcome,
    onReturnHome
}: {
    outcome: GameEventWinnerPairDeterminated
    onReturnHome: () => void
}) =>  {
    if (!outcome) return null;

    const getTitle = () => {
        if (outcome.winner === GameWinner.DRAW) return "Game Drawn!";
        if (outcome.gameEvent === GameEvent.RESIGNATION) return "Resignation";
        if (outcome.gameEvent === GameEvent.CHECKMATE) return "Checkmate";
        if (outcome.gameEvent === GameEvent.IMPASSE) return "Impasse";
        if (outcome.gameEvent === GameEvent.STALEMATE) return "Stalemate";
        return "Game Over";
    };

    const getDescription = () => {
        if (outcome.winner === GameWinner.WHITE_WINNER) return "White Player Wins!";
        if (outcome.winner === GameWinner.BLACK_WINNER) return "Black Player Wins!";
        if (outcome.winner === GameWinner.DRAW) return "The game ends in a draw";
        return "The game has concluded";
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background w-full max-w-md p-6 rounded-lg shadow-lg space-y-4">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-center">{getTitle()}</h3>
                    <p className="text-muted-foreground text-center">{getDescription()}</p>
                </div>
                <button
                    onClick={onReturnHome}
                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default GameOverOverlay;