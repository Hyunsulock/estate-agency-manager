import { HousePropertyStatus, tradeTypes } from "@/components/table/types"
import { parseAsString, parseAsStringEnum, useQueryStates, parseAsInteger } from "nuqs"

export const useHousePropertyFilters = () => {
    return useQueryStates({
        tradeType: parseAsStringEnum(Object.values(tradeTypes)).withDefault(tradeTypes.SALE),
        status: parseAsStringEnum(Object.values(HousePropertyStatus)),
        apartmentId: parseAsString,
        minDeposit: parseAsInteger,
        maxDeposit: parseAsInteger,
        minRent: parseAsInteger,
        maxRent: parseAsInteger,
    }, { shallow: false })
}