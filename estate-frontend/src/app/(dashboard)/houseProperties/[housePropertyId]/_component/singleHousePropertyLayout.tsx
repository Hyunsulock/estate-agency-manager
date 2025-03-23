"use client";
import { useQuery } from "@tanstack/react-query";
import { getSingleHouseProperty } from "../../../../lib/queryFunctions/getSingleHouseProperty";
import { useGetSingleHouseProperty } from "@/app/lib/useGetFunctions/useGetSingleHouse";
import { RealtimeEditForm } from "./singleHousePropertyEditView";
import { OfferBarChart } from "./offerBarChart";

export default function SingleHousePropertyLayout({ id }: { id: string }) {
    return (
        <div className="flex flex-wrap justify-center gap-6 p-4">
            <div className="w-full sm:w-auto min-w-[480px] max-w-[480px]">
                <RealtimeEditForm id={id} />
            </div>
            <div className="w-full sm:w-auto min-w-[480px] max-w-[480px]">
                <OfferBarChart />
            </div>
        </div>
    );
}
