import { useQuery } from "@tanstack/react-query";
import { getAgencies } from "../queryFunctions/getAgencies";


export const useGetAgencies = () => {
    const query = useQuery({
        queryKey: ["agencies"],
        queryFn: getAgencies,
    });
    return query
}
