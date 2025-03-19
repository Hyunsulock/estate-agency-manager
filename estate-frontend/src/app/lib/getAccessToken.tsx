'use server'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function getAccessSession() {
    const session = await getServerSession(authOptions);
    return session?.accessToken
}
