import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "@/app/lib/getAccessToken"
import { QueryFunction } from "@tanstack/react-query";

export const getOffersByHouseProperty: QueryFunction<any, [_1: string, housePropertyid: string, tradeType: string]> = async ({ queryKey }) => {
    const [_1, housePropertyid, tradeType] = queryKey;
    const session = await getAccessSession();
    const res = await fetch(Backend_URL + `/offers/by-property/${housePropertyid}/by-trade-type/${tradeType}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['offer', housePropertyid] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}


