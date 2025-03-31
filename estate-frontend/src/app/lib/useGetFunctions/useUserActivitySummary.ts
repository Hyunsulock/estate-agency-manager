import { useQuery } from "@tanstack/react-query";

import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

type RawActivity = {
    tableName: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    count: number;
};

export const useUserActivitySummary = () => {
    return useQuery({
        queryKey: ["user-activity-summary"],
        queryFn: async () => {
            const token = await getAccessSession();
            const res = await fetch(`${Backend_URL}/user-histories/activity`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch user activity");
            const raw: RawActivity[] = await res.json();

            // 1. create 그래프용 데이터 가공
            const createChart = raw
                .filter((row) => row.action === "CREATE")
                .map((row) => ({
                    tableName: row.tableName,
                    visitors: Number(row.count),
                }));

            // 2. update + delete 그래프용 데이터 가공
            const updateDeleteMap: Record<string, { update: number; delete: number }> = {};
            raw.forEach((row) => {
                const table = row.tableName;
                if (!updateDeleteMap[table]) updateDeleteMap[table] = { update: 0, delete: 0 };

                if (row.action === "UPDATE") updateDeleteMap[table].update += Number(row.count);
                if (row.action === "DELETE") updateDeleteMap[table].delete += Number(row.count);
            });

            const updateDeleteChart = Object.entries(updateDeleteMap).map(([tableName, value]) => ({
                tableName,
                ...value,
            }));

            return {
                createChart,
                updateDeleteChart,
            };
        },
        staleTime: 0
    });
};
