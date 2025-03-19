'use server'

import {GameRepository} from "@/repository/game";
import {createServerAction, ServerActionError} from "@/utils/action";
import {
    BoardConfiguration,
    TGameHistoryPaginatedPayload,
    TGameHistoryPaginatedResponse,
    TGamePaginatedGetPayload,
    TGamePaginatedGetResponse
} from "@/types/game";

export const paginatedGet = createServerAction<TGamePaginatedGetResponse, [TGamePaginatedGetPayload]>(
    async (data) => {
        try {
            console.log("Getting games with payload",data)
            return await GameRepository.paginatedGet(data)
        } catch(e : any) {
            console.log("Error from getting games",e)
            throw new ServerActionError(e.response.data)
        }
    }
)

export const paginatedGetHistory = createServerAction<TGameHistoryPaginatedResponse, [TGameHistoryPaginatedPayload]>(
    async (data) => {
        try {
            return await GameRepository.paginatedGetHistory(data)
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)

export const getDefaultConfiguration = createServerAction<BoardConfiguration, []>(
    async () => {
        try {
            return await GameRepository.getDefaultConfiguration()
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)