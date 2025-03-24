import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";

export async function getUsers() {
    const session = await getAccessSession();
    const res = await fetch(Backend_URL + "/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['users'] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const response = await res.json()
    return response;
}
