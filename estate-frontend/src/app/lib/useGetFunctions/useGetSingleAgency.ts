import { useQuery } from "@tanstack/react-query";
import { getSingleAgency } from "../queryFunctions/getSingleAgency";


export const useGetSingleAgency = (id: string) => {
    const query = useQuery({
        queryKey: ["agency", id],
        queryFn: getSingleAgency,
    });
    return query
}