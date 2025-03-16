import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {TGamePaginatedGetPayload, TGamePaginatedGetResponse} from "@/types/game";
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
}
