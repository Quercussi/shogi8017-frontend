'use server';

import {createServerAction, ServerActionError} from "@/utils/action";
import { TokenRepository } from "@/repository/token";
import {TWebSocketRequestResponse} from "@/types/token";

export const getWebSocketToken = createServerAction<TWebSocketRequestResponse, []>(
    async () => {
        try {
            return await TokenRepository.getWebSocketToken();
        } catch (error: any) {
            throw new ServerActionError(error.response);
        }
    }
);