import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";
import { QueryFunction } from "@tanstack/react-query";


export const getDealsQuery: QueryFunction<any, [_1: string, params: {
    tradeType?: string | null,
    apartmentId?: string | null,
    buildingNumber?: number | null, 
    unitNumber?: number | null, 
    buyerName?: string | null,
    sellerName?: string | null,
    sellerAgencyName?: string | null,
    buyerAgencyName?: string | null,
    dealDateStartRange?: string | null,
    dealDateEndRange?: string | null,

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

    console.log(`get deals called, ${searchParams}`);
    const res = await fetch(`${Backend_URL}/deals/search?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['deal'] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const response = await res.json()
    return response;
}
