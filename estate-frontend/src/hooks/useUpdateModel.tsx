import { ResponsiveModal } from "../components/responsive-modal";
import { useQueryState, parseAsBoolean, useQueryStates, parseAsString } from "nuqs";

export const useUpdateModal = (stateString: string) => {

    const [filter, setFilter ] = useQueryStates({
        stateString: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        id: parseAsString
    });

    const open = () =>
        setFilter((prev) => ({
            ...prev,
            stateString: true,
        }));

    const close = () =>
        setFilter((prev) => ({
            ...prev,
            stateString: false,
        }));

    const setIsOpen = (value: boolean) =>
        setFilter((prev) => ({ ...prev, stateString: value }));


    
    return {
        isOpen: filter.stateString,
        id: filter.id,
        open,
        close,
        setIsOpen,
        setFilter
    };
};
