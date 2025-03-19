'use server'

import {UserRepository} from "@/repository/user";
import {
    TUserGetByIdPayload,
    TUserPaginatedSearchPayload,
    TUserPaginatedSearchResponse,
    TUserSignUpPayload, UserModel
} from "@/types/user";
import {createServerAction, ServerActionError} from "@/utils/action";
import {Maybe} from "@/types/type-constructor";

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

export const getById = createServerAction<Maybe<UserModel>, [TUserGetByIdPayload]>(
    async (data) => {
        try {
            return await UserRepository.getById(data)
        } catch(e : any) {
            throw new ServerActionError(e.response.data)
        }
    }
)