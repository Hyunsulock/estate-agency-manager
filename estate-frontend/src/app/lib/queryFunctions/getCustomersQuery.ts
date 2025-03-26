import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";
import { QueryFunction } from "@tanstack/react-query";


export const getCustomersQuery: QueryFunction<any, [_1: string, params: {
    name?: string | null;
    phoneNumber?: string | null;
    intro? : string | null;
    
}]> = async ({ queryKey }) => {
    const session = await getAccessSession();
    const [_1, params] = queryKey;
    console.log("get apartments called");
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
        }
    });

    console.log(`get agencies called, ${searchParams}`);
    const res = await fetch(`${Backend_URL}/customers/search?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['customers'] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const response = await res.json()
    return response;
}
