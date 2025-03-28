import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";
import { QueryFunction } from "@tanstack/react-query";


export const getHistoriesQuery: QueryFunction<any, [_1: string, params: {
    userId?: number | null,
    action?: string | null,
    tableName?: string | null,
    historyDateStartRange?: string | null,
    historyDateEndRange?: string | null,
}]> = async ({ queryKey }) => {
    const session = await getAccessSession();
    const [_1, params] = queryKey;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
        }
    });
    const res = await fetch(`${Backend_URL}/user-histories/search?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['history'] },
        cache: "no-store",
    });

    if (!res.ok) {
        console.log(res)
        throw new Error("Failed to fetch data");
    }

    const response = await res.json()
    return response;
}
