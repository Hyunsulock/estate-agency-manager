
import { useQuery } from "@tanstack/react-query";
import { getSingleOffer } from "../queryFunctions/getSingleOfferById";




export const useGetSingleOffer = (housePropertyId: string, id: string) => {
    const query = useQuery({
        queryKey: ["houseProperty", housePropertyId, id],
        queryFn: getSingleOffer,
    });
    return query
}