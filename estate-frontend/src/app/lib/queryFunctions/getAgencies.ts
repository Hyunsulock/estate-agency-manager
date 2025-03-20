import { Backend_URL } from "@/app/lib/Constants";
import getAccessSession from "../getAccessToken";

export async function getAgencies() {
    const session = await getAccessSession();
    console.log("get apartments called");
    const res = await fetch(Backend_URL + "/agencies", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
        },
        next: { tags: ['agencies'] },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const response = await res.json()
    return response;
}
