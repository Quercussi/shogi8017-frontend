import "next-auth";
import "next-auth/jwt";

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        accessToken: string;
        accessTokenExpiry: number;
        refreshToken: string;
        refreshTokenExpiry: number;
    }

    interface Session {
        user: {
            username: string;
            accessToken: string;
            accessTokenExpiry: number;
            refreshToken: string;
            refreshTokenExpiry: number;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        username: string;
        accessToken: string;
        accessTokenExpiry: number;
        refreshToken: string;
        refreshTokenExpiry: number;
        error?: string;
    }
}