import { useQuery } from "@tanstack/react-query";
import { getHistoriesQuery } from "../queryFunctions/getHistoriesQuery";

interface UseGetHistoriesProps {
    userId?: number | null,
    action?: string | null,
    tableName?: string | null,
    historyDateStartRange?: string | null,
    historyDateEndRange?: string | null,
}

export const useGetHistoriesQuery = ({ userId, action, tableName, historyDateStartRange, historyDateEndRange, }: UseGetHistoriesProps) => {
    const query = useQuery({
        queryKey: ["history", { userId, action, tableName, historyDateStartRange, historyDateEndRange }],
        queryFn: getHistoriesQuery,
        staleTime: 0

    });
    return query
}
