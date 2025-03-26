import { ResponsiveModal } from "../components/responsive-modal";
import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateModal = (stateString: string) => {
    const [isOpen, setIsOpen] = useQueryState(
        stateString,
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    );

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return {
        isOpen,
        open,
        close,
        setIsOpen,
    };
};
