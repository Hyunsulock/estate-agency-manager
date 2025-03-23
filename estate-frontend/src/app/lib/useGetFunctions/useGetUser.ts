import { useQuery } from "@tanstack/react-query";
import getUser from "../queryFunctions/getUser";
import getSessionServer from "../getSessionServer";


export const useGetUser = () => {
    const query = useQuery({
        queryKey: ["user"],
        queryFn: getSessionServer,
    });
    return query
}

