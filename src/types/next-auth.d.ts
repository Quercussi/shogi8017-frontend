import "next-auth";
import "next-auth/jwt";
import {UserModel} from "@/types/user";

declare module 'next-auth' {
    interface User {
        id: string;
        userInfo: UserModel;
        accessToken: string;
        accessTokenExpiry: number;
        refreshToken: string;
        refreshTokenExpiry: number;
    }

    interface Session {
        user: {
            userInfo: UserModel;
            accessToken: string;
            accessTokenExpiry: number;
            refreshToken: string;
            refreshTokenExpiry: number;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userInfo: UserModel;
        accessToken: string;
        accessTokenExpiry: number;
        refreshToken: string;
        refreshTokenExpiry: number;
        error?: string;
    }
}