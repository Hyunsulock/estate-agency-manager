"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function getSessionServer() {
    const session = await getServerSession(authOptions);
    console.log("seesion called");
    return session;
}
