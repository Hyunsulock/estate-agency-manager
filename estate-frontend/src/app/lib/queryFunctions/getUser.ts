import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function getUser() {
    const session = await getServerSession(authOptions);
    const id = session?.id;
    const name = session?.name;
    const email = session?.email;
    if (!session) throw new Error("No user session found");
    return { id, name, email }
}
