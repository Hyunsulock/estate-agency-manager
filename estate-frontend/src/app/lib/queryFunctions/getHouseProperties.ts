import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";
import { QueryFunction } from "@tanstack/react-query";
import { HousePropertyStatus, tradeTypes } from "@/components/table/types";

export const getHouseProperties: QueryFunction<any, [_1: string, params: {
    status?: HousePropertyStatus | null,
    tradeType?: tradeTypes | null,
    apartmentId?: string | null,
    minDeposit?: number | null;
    maxDeposit?: number | null;
    minRent?: number | null;
    maxRent?: number | null;
    minSize?: number | null;
    maxSize?: number | null;
    offerCount?: number | null;
    unitNumber?: number | null;
    buildingNumber?: number | null;
}]> = async ({ queryKey }) => {
    const session = await getAccessSession();
    const [_1, params] = queryKey;
    // Build query string dynamically from params
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString()

    console.log(`get house called, ${queryString}, ${params.status}`);
    const res = await fetch(Backend_URL + `/house-properties/search?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const response = await res.json()
    return response;
}
