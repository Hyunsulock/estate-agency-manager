import { useQuery } from "@tanstack/react-query";
import { getUserServer } from "../queryFunctions/getUserServer";

export const useGetUserServer = (id: string) => {
    const query = useQuery({
        queryKey: ["users", id],
        queryFn: getUserServer,
    });
    return query
}
