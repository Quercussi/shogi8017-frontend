'use server'

import {UserRepository} from "@/repository/user";
import {TUserSignUpPayload} from "@/types/user";
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