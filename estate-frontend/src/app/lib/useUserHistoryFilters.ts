import {
    parseAsString,
    parseAsInteger,
    useQueryStates,
} from "nuqs";

export const useUserHistoryFilters = () => {
    return useQueryStates(
        {
            tableName: parseAsString,
            userId: parseAsInteger,
            recordId: parseAsInteger,
            action: parseAsString,
            userHistoryDateStartRange: parseAsString,
            userHistoryDateEndRange: parseAsString,
        },
        { shallow: false, clearOnDefault: false }
    );
};

