import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {
    BoardConfiguration,
    TGameHistoryPaginatedPayload,
    TGameHistoryPaginatedResponse,
    TGamePaginatedGetPayload,
    TGamePaginatedGetResponse
} from "@/types/game";

export class GameRepository {
    static async paginatedGet(payload: TGamePaginatedGetPayload): Promise<TGamePaginatedGetResponse> {
        const {data} = await axios.get<TGamePaginatedGetResponse>(`${apiEndpoints.game.paginatedGet}`, {
            params: {
                offset: payload.offset,
                limit: payload.limit,
            }
        });
        console.log(data);
        return data;
    }

    static async paginatedGetHistory(payload: TGameHistoryPaginatedPayload): Promise<TGameHistoryPaginatedResponse> {
        const {data} = await axios.get<TGameHistoryPaginatedResponse>(`${apiEndpoints.game.paginatedGetHistory(payload.gameCertificate)}`, {
            params: {
                offset: payload.offset,
                limit: payload.limit,
            }
        });
        return data;
    }

    static async getDefaultConfiguration(): Promise<BoardConfiguration> {
        const {data} = await axios.get<BoardConfiguration>(`${apiEndpoints.game.getDefaultConfiguration}`);

        return data;
    }
}
