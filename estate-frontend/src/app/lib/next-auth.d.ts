import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        id: string;
        name: string;
        email: string;
        agency: number
        accessToken: string;
        refreshToken: string;
        tokenRenew: number;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        agency: number
        accessToken: string;
        refreshToken: string;
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        tokenRenew: number;
        agency: number
    };
}
