"use client";

import { useState, useEffect } from "react";
import type { InvitationNotificationEvent } from "@/types/ws-invitation";
import { getWebSocketToken } from "@/actions/token";
import { useSession } from "next-auth/react";

export function useInvitationWebSocket() {
    const { data: session } = useSession();
    const [invitations, setInvitations] = useState<InvitationNotificationEvent[]>([]);
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

                socket = new WebSocket(
                    `ws://10.82.8.153:8018/api/ws/v1/invite?websocketAccessToken=${result.value.websocketAccessToken}`
                );

                socket.onmessage = (msg) => {
                    try {
                        const data = JSON.parse(msg.data);
                        if (data.type === "InvitationNotification") {
                            const invitation = data.event as InvitationNotificationEvent;
                            setInvitations(prev => [...prev, invitation]);
                        }
                    } catch (error) {
                        console.error("Error processing message:", error);
                    }
                };

                socket.onclose = () => {
                    console.log("WebSocket closed");
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
            clearTimeout(retryTimeout);
        };
    }, [session?.user?.accessToken, retryCount]);

    const removeInvitation = (gameCertificate: string) => {
        setInvitations(prev =>
            prev.filter(inv => inv.gameCertificate !== gameCertificate)
        );
    };

    return { invitations, removeInvitation };
}
