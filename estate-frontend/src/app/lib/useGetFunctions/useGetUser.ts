import { useQuery } from "@tanstack/react-query";
import getSessionServer from "../getSessionServer";
import { getUser } from "../queryFunctions/getUser";


export const useGetUser = (id: string) => {
    const query = useQuery({
        queryKey: ["user", id],
        queryFn: getUser,
    });
    return query
}

