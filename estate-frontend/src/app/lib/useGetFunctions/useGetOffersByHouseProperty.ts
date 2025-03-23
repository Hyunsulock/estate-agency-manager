import { useQuery } from "@tanstack/react-query";
import { getOffersByHouseProperty } from "../queryFunctions/gettOffersByHouseProperty";




export const useGetSingleHouseProperty = (housePropertyId: string) => {
    const query = useQuery({
        queryKey: ["offer", housePropertyId],
        queryFn: getOffersByHouseProperty,
    });
    return query
}