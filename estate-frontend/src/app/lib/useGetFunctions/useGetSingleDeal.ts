import { useQuery } from "@tanstack/react-query";
import { getSingleDeal } from "../queryFunctions/getSingleDeal";


export const useGetSingleDeal = (id: string) => {
    const query = useQuery({
        queryKey: ["deal", id],
        queryFn: getSingleDeal,
    });
    return query
}