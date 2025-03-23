import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getHouseProperties } from "../queryFunctions/getHouseProperties";
import { HousePropertyStatus, tradeTypes } from "@/components/table/types";

interface UseGetHousePropertiesProps {
    status?: HousePropertyStatus | null;
    tradeType?: tradeTypes | null;
    apartmentId?: string | null;
    minDeposit?: number | null;
    maxDeposit?: number | null;
    minRent?: number | null;
    maxRent?: number | null;
    minSize?: number | null;
    maxSize?: number | null;
    offerCount?: number | null;
    unitNumber?: number | null;
    buildingNumber?: number | null;
}

export const useGetHouseProperties = ({ status, tradeType, apartmentId, minDeposit, maxDeposit, minRent, maxRent, minSize, maxSize, offerCount, unitNumber, buildingNumber }: UseGetHousePropertiesProps) => {
    const query = useQuery({
        queryKey: ["houseProperty", { tradeType, status, apartmentId, minDeposit, maxDeposit, minRent, maxRent, minSize, maxSize, offerCount, unitNumber, buildingNumber }],
        queryFn: getHouseProperties,
        staleTime: 0
    });
    return query
}
