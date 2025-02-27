import {UserModel} from "@/types/user";

export type TUserLoginPayload = {
    username: string,
    password: string
}

export type TUserLoginResponse =  {
    user: UserModel;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
};

export type TTokenRefreshResponse = TUserLoginResponse

export type TErrorResponse = {
    message: string;
    code?: number;
    details?: Record<string, unknown>;
};