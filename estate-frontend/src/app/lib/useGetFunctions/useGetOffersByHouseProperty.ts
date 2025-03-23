import { useQuery } from "@tanstack/react-query";
import { getOffersByHouseProperty } from "../queryFunctions/gettOffersByHouseProperty";




export const useGetOffersByHouseProperty = (housePropertyId: string, tradeType: string) => {
    const query = useQuery({
        queryKey: ["offer", housePropertyId, tradeType],
        queryFn: getOffersByHouseProperty,
    });
    return query
}