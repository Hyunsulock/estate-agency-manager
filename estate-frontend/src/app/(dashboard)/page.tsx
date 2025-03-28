"use client";

import { useSession } from "next-auth/react";
import { useUserActivitySummary } from "@/app/lib/useGetFunctions/useUserActivitySummary";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateDeleteRadialCard } from "../_component/UpdateDeleteRadialCard";
import DealRecentSwitcher from "../_component/dealRecentSwitcher";

export default function HomePage() {
    const { data, isLoading } = useUserActivitySummary();

    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
            </div>
        );
    }

    const getTableData = (tableName: string) => {
        const create =
            data.createChart.find((d) => d.tableName === tableName)?.visitors ||
            0;
        const update =
            data.updateDeleteChart.find((d) => d.tableName === tableName)
                ?.update || 0;
        const del =
            data.updateDeleteChart.find((d) => d.tableName === tableName)
                ?.delete || 0;
        return { create, update, delete: del };
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <UpdateDeleteRadialCard
                    title="Offers"
                    {...getTableData("offers")}
                />
                <UpdateDeleteRadialCard
                    title="Deals"
                    {...getTableData("deals")}
                />
                <UpdateDeleteRadialCard
                    title="HouseProperties"
                    {...getTableData("houseProperties")}
                />
            </div>
            <DealRecentSwitcher />
        </div>
    );
}
