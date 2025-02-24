import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {TWebSocketRequestResponse} from "@/types/token";
export class TokenRepository {
    static async getWebSocketToken(): Promise<TWebSocketRequestResponse> {
        const { data } = await axios.post<TWebSocketRequestResponse>(`${apiEndpoints.auth.websocket}`);
        return data;
    }
}
