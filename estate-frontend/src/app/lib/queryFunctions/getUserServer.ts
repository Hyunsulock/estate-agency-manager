import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";
import { QueryFunction } from "@tanstack/react-query";

export const getUserServer: QueryFunction<any, [_1: string, id: string] > = async ({ queryKey }) => {
    const [_1, id] = queryKey;
    const session = await getAccessSession();
    const res = await fetch(Backend_URL + `/users/${id}`, {
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

