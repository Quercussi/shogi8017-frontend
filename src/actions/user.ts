'use server'

import {UserRepository} from "@/repository/user";
import {
    MaybeUserModel,
    TUserGetByIdPayload,
    TUserPaginatedSearchPayload,
    TUserPaginatedSearchResponse,
    TUserSignUpPayload
} from "@/types/user";
import {createServerAction, ServerActionError} from "@/utils/action";

export const signUp =  createServerAction<void,[TUserSignUpPayload]>(
    async (data) => {
        try {
            await UserRepository.signUp(data)
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)

export const paginatedSearch = createServerAction<TUserPaginatedSearchResponse, [TUserPaginatedSearchPayload]>(
    async (data) => {
        try {
            return await UserRepository.paginatedSearch(data)
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)

export const getById = createServerAction<MaybeUserModel, [TUserGetByIdPayload]>(
    async (data) => {
        try {
            return await UserRepository.getById(data)
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)