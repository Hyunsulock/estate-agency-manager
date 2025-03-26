import { tradeTypes } from "@/components/table/types";
import {
    parseAsString,
    parseAsStringEnum,
    parseAsInteger,
    useQueryStates,
} from "nuqs";

export const useDealFilters = () => {
    return useQueryStates({
        tradeType: parseAsStringEnum(Object.values(tradeTypes)).withDefault(tradeTypes.SALE),
        apartmentId: parseAsString,
        buildingNumber: parseAsInteger,
        unitNumber: parseAsInteger,
        buyerName: parseAsString,
        sellerName: parseAsString,
        sellerAgencyName: parseAsString,
        buyerAgencyName: parseAsString,
        dealDateStartRange: parseAsString,
        dealDateEndRange: parseAsString,

    },
        { shallow: false, clearOnDefault: false, });
};