import { useQuery } from "@tanstack/react-query";
import { getApartments } from "../queryFunctions/getApartments";

export const useGetApartments = () => {
    const query = useQuery({
        queryKey: ["apartments"],
        queryFn: getApartments,
    });
    return query
}
