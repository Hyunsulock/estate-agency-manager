import { useQuery } from "@tanstack/react-query";
import { getSingleHouseProperty } from "../queryFunctions/getSingleHouseProperty";



export const useGetSingleHouseProperty = (id: string)=> {
    const query = useQuery({
        queryKey: ["houseProperty", id],
        queryFn: getSingleHouseProperty,
    });
    return query
}