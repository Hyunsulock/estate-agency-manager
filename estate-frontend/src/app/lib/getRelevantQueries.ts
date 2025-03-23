import { QueryClient } from "@tanstack/react-query";

export const getRelevantQueries = (
    queryClient: QueryClient,
    queryKeyPrefix: string | (string | number)[]
) => {
    const queries = queryClient.getQueryCache().findAll({
        queryKey: Array.isArray(queryKeyPrefix) ? queryKeyPrefix : [queryKeyPrefix],
        exact: false,
    });

    return queries.filter((query) => {
        return query.isActive() || !query.isStale();
    });
};
