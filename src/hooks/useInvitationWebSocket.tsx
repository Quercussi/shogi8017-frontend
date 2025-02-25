"use client";

import { useState, useEffect, useRef } from "react";
import {
    InvitationEvent,
    InvitationNotificationEvent, InvitationNotificationEventPayload,
    InvitationRequest,
    RegularInvitationBody, RegularInvitationBodyPayload
} from "@/types/ws-invitation";
import { getWebSocketToken } from "@/actions/token";
import { useSession } from "next-auth/react";
import wsEndpoints from "@/context/wsEndpoints";

type WsMessage = {
    type: "InvitationNotification" | "InvitationResponse" | "InvalidInvitation";
    event?: any;
    message?: string;
};

export function useInvitationWebSocket() {
    const { data: session } = useSession();
    const [invitations, setInvitations] = useState<InvitationNotificationEventPayload[]>([]);
    const [createdInvitation, setCreatedInvitation] = useState<{ gameCertificate: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!session?.user?.accessToken) return;

        let socket: WebSocket | null = null;
        let retryTimeout: ReturnType<typeof setTimeout>;

        const connectWebSocket = async () => {
            try {
                const result = await getWebSocketToken();
                if (!result.success) {
                    throw new Error(`Failed to get WebSocket token: ${result.error}`);
                }

                const wsUrl = new URL(`${process.env.NEXT_PUBLIC_WS_API_URL}${wsEndpoints.invitation}`);
                wsUrl.searchParams.append('websocketAccessToken', result.value.websocketAccessToken);
                socket = new WebSocket(wsUrl.toString());
                wsRef.current = socket;

                socket.onmessage = (msg) => {
                    try {
                        const data: InvitationEvent = JSON.parse(msg.data);
                        switch (data.type) {
                            case "InvitationNotification":
                                setInvitations(prev => [...prev, data.event]);
                                break;
                            case "InvitationResponse": // TODO: change this
                                setCreatedInvitation(data.event);
                                break;
                            case "InvalidInvitation":
                                setError(data.event.errorMessage || "Unknown error");
                                break;
                        }
                    } catch (error) {
                        console.error("Error processing message:", error);
                    }
                };

                socket.onclose = () => {
                    retryTimeout = setTimeout(
                        () => setRetryCount(prev => prev + 1),
                        Math.min(1000 * 2 ** retryCount, 10000)
                    );
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    socket?.close();
                };

            } catch (error) {
                console.error("WebSocket connection failed:", error);
                retryTimeout = setTimeout(() => setRetryCount(prev => prev + 1), 5000);
            }
        };

        connectWebSocket();

        return () => {
            socket?.close();
            wsRef.current = null;
            clearTimeout(retryTimeout);
        };
    }, [session?.user?.accessToken, retryCount]);

    const requestInvitation = (payload: RegularInvitationBodyPayload) => {
        const message: RegularInvitationBody = {
            action: 'invite',
            payload: payload,
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            setError("Connection not ready");
        }
    };

    const removeInvitation = (gameCertificate: string) => {
        setInvitations(prev =>
            prev.filter(inv => inv.gameCertificate !== gameCertificate)
        );
    };

    return { invitations, removeInvitation, requestInvitation, createdInvitation, error };
}