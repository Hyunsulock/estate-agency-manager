import { useQuery } from "@tanstack/react-query";
import { getDealsQuery } from "../queryFunctions/getDealsQuery";

interface UseGetCustomersProps {
    tradeType?: string | null,
    apartmentId?: string | null,
    buildingNumber?: number | null,
    unitNumber?: number | null,
    buyerName?: string | null,
    sellerName?: string | null,
    sellerAgencyName?: string | null,
    buyerAgencyName?: string | null,
    dealDateStartRange?: string | null,
    dealDateEndRange?: string | null,
}

export const useGetDealsQuery = ({ tradeType, apartmentId, buildingNumber, unitNumber, buyerName, sellerName, sellerAgencyName, buyerAgencyName, dealDateStartRange, dealDateEndRange }: UseGetCustomersProps) => {
    const query = useQuery({
        queryKey: ["deal", { tradeType, apartmentId, buildingNumber, unitNumber, buyerName, sellerName, sellerAgencyName, buyerAgencyName, dealDateStartRange, dealDateEndRange }],
        queryFn: getDealsQuery,

    });
    return query
}
