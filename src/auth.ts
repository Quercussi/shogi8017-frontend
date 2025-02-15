import { AuthRepository } from '@/repository/auth';
import Credentials from 'next-auth/providers/credentials';
import { shouldRefreshToken } from '@/utils/helpers';
import apiEndpoints from '@/context/apiEndpoints';
import { TTokenRefreshResponse } from '@/types/auth';
import NextAuth, {Session, User} from "next-auth";
import {JWT} from "next-auth/jwt"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                try {
                    const { username, password } = credentials as {
                        username: string;
                        password: string
                    };

                    const response = await AuthRepository.signIn({username, password});

                    return {
                        id: username,
                        username: username,
                        accessToken: response.accessToken,
                        accessTokenExpiry: response.accessTokenExpiry,
                        refreshToken: response.refreshToken,
                        refreshTokenExpiry: response.refreshTokenExpiry,
                    } as User;

                } catch (error) {
                    let message = "Authentication failed";

                    if (error instanceof Error) {
                        message = error.message;
                    } else if (typeof error === "object" && error !== null && "response" in error) {
                        const err = error as { response?: { data?: { message?: string } } };
                        message = err.response?.data?.message || "Authentication failed";
                    }

                    throw new Error(message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User}) {
            if (user) {
                return {
                    ...token,
                    ...user,
                };
            }

            if (token.refreshToken && shouldRefreshToken(new Date(token.accessTokenExpiry), 10)) {
                try {
                    const res = await fetch(apiEndpoints.auth.refresh, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token.refreshToken}`,
                        },
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || "Token refresh failed");
                    }

                    const data: TTokenRefreshResponse = await res.json();

                    return {
                        ...token,
                        accessToken: data.accessToken,
                        accessTokenExpiry: data.accessTokenExpiry,
                        refreshToken: data.refreshToken,
                        refreshTokenExpiry: data.refreshTokenExpiry,
                    };

                } catch (error) {
                    let errorMessage = "Token refresh failed";
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    return { ...token, error: errorMessage };
                }
            }

            return token;
        },

        async session({ session, token }: { session: Session, token: JWT }) {
            session.user = {
                username: token.username,
                accessToken: token.accessToken,
                accessTokenExpiry: token.accessTokenExpiry,
                refreshToken: token.refreshToken,
                refreshTokenExpiry: token.refreshTokenExpiry,
            };

            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
    },
    debug: true,
});