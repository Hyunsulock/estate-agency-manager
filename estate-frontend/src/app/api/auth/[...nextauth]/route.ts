import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth"
import { Backend_URL } from "@/app/lib/Constants";
import { headers } from "next/headers";
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next"

async function refreshAccessToken(token: any) {
    try {
        const res = await fetch(`${Backend_URL}/auth/token/access`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.refreshToken}`
            },
        });
        const refreshedTokens = await res.json();
        if (!res.ok) throw new Error(`Failed to refresh token: ${res.status} refresh token : ${token.refreshToken}`);

        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Keep old refreshToken if not returned
            tokenRenew: Date.now() + 30000, // New expiration
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}


export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
        newUser: '/signin',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Hyunsu",
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                console.log('hoe')
                if (!credentials?.username || !credentials?.password) {
                    return null
                }
                const basicAuth = Buffer.from(`${credentials?.username}:${credentials?.password}`).toString("base64");
                const res = await fetch(Backend_URL + "/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${basicAuth}`
                    }
                });
                if (!res.ok) {
                    console.log(res.statusText);
                    return null
                }
                const data = await res.json();

                return {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                }

            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt", // Use JWT for authentication
    },
    callbacks: {
        async jwt({ token, user }) {
            //console.log({ token, user })
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.refreshToken = user.refreshToken;
                token.accessToken = user.accessToken; // Store JWT token
                token.tokenRenew = Date.now() + 30000;
            }

            if (Date.now() > token.tokenRenew) {
                token = await refreshAccessToken(token);
            }
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.id= token.id as string;
                session.name = token.name;
                session.email = token.email;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.tokenRenew = token.tokenRenew as number;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // 🔹 Redirect users after login/logout
            return baseUrl; // Always redirect to dashboard
        },
    },

}

export function auth(  // <-- use this function to access the jwt from React components
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }