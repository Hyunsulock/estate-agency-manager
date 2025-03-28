import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "@/app/lib/getAccessToken"
import { QueryFunction } from "@tanstack/react-query";

export const getSingleDeal: QueryFunction<any, [_1: string, id: string]> = async ({ queryKey }) => {
    const [_1, id] = queryKey;
    const session = await getAccessSession();
    const res = await fetch(Backend_URL + `/deals/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['deal', id] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}


