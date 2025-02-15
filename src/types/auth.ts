export type TUserLoginPayload = {
    username: string,
    password: string
}

export type TUser = {
    username: string
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
}

export type TUserLoginResponse = TTokenRefreshResponse & {
    username: string;
};

export type TTokenRefreshResponse = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
}

export type TErrorResponse = {
    message: string;
    code?: number;
    details?: Record<string, unknown>;
};