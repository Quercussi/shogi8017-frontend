"use client";

import React, {
    createContext,
    useState,
    useEffect,
    useRef,
    useContext,
    ReactNode
} from "react";
import { useSession } from "next-auth/react";
import { getWebSocketToken } from "@/actions/token";
import wsEndpoints from "@/context/wsEndpoints";
import type {
    BoardConfigurationEventPayload,
    ExecutionActionEventPayload,
    GameActionEvent,
    GameActionRequest, InvalidGameActionPayload,
    MakeDropRequestPayload,
    MakeMoveRequestPayload,
    ResignRequestPayload,
} from "@/types/ws-game";

type GameContextType = {
    requestAction: {
        makeMove: (payload: MakeMoveRequestPayload) => void;
        makeDrop: (payload: MakeDropRequestPayload) => void;
        resign: (payload: ResignRequestPayload) => void;
    };
    events: {
        boardConfig: BoardConfigurationEventPayload | null;
        action: ExecutionActionEventPayload | null;
        error: InvalidGameActionPayload | null;
        resigned: boolean;
    };
    setGameCertificate: (certificate: string) => void;
};

const GameContext = createContext<GameContextType | null>(null);

type GameProviderProps = {
    children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
    const { data: session } = useSession();
    const [boardConfig, setBoardConfig] = useState<BoardConfigurationEventPayload | null>(null);
    const [action, setAction] = useState<ExecutionActionEventPayload | null>(null);
    const [error, setError] = useState<InvalidGameActionPayload | null>(null);
    const [resigned, setResigned] = useState(false);

    const [gameCertificate, setGameCertificate] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!session?.user?.accessToken) return;

        if(!gameCertificate) return;

        let socket: WebSocket | null = null;
        let retryTimeout: ReturnType<typeof setTimeout>;

        const connectWebSocket = async () => {
            try {
                console.log("Connecting to game websocket");

                const result = await getWebSocketToken();
                if (!result.success) {
                    throw new Error(`Failed to get WebSocket token: ${result.error}`);
                }

                const wsUrl = new URL(`${process.env.NEXT_PUBLIC_WS_API_URL}${wsEndpoints.game}/${gameCertificate}`);
                wsUrl.searchParams.append('websocketAccessToken', result.value.websocketAccessToken);
                wsUrl.searchParams.append('gameCertificate', gameCertificate);

                socket = new WebSocket(wsUrl.toString());
                wsRef.current = socket;
                console.log("connected ", wsRef.current)

                socket.onmessage = (msg) => {
                    try {
                        const data: GameActionEvent = JSON.parse(msg.data);
                        switch (data.type) {
                            case "BoardConfiguration":
                                setBoardConfig(data.event);
                                break;
                            case "ExecutionAction":
                                setAction(data.event);
                                break;
                            case "InvalidGameAction":
                                setError(data.event);
                                break;
                        }
                    } catch (error) {
                        setError({errorMessage: "Failed to parse game message"});
                    }
                };

                socket.onclose = () => {
                    console.log("Disconnecting game websocket");
                    console.log("Retry count game websocket:", retryCount);

                    setRetryCount(prev => Math.min(prev + 1, 5));
                    retryTimeout = setTimeout(
                        () => connectWebSocket(),
                        Math.min(1000 * 2 ** retryCount, 10000)
                    );
                };

                socket.onerror = (error) => {
                    setError({errorMessage: "Game connection error"});
                    socket?.close();
                };

            } catch (error) {
                setError({errorMessage: "Failed to connect to game"});
                retryTimeout = setTimeout(() => setRetryCount(prev => prev + 1), 5000);
            }
        };

        connectWebSocket();

        return () => {
            socket?.close();
            wsRef.current = null;
            clearTimeout(retryTimeout);
        };
    }, [session?.user?.accessToken, gameCertificate, retryCount]);

    const sendMessage = (action: GameActionRequest['action'], payload: GameActionRequest['payload']) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ action, payload }));
        } else {
            setError({errorMessage: "Game connection not ready"});
        }
    };

    const makeMove = (payload: MakeMoveRequestPayload) => sendMessage("makeMove", payload);
    const makeDrop = (payload: MakeDropRequestPayload) => sendMessage("makeDrop", payload);
    const handleResign = (payload: ResignRequestPayload) => {
        sendMessage("resign", payload);
        setResigned(true);
    };

    const contextValue: GameContextType = {
        requestAction: {
            makeMove,
            makeDrop,
            resign: handleResign
        },
        events: {
            boardConfig,
            action,
            error,
            resigned
        },
        setGameCertificate
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
}