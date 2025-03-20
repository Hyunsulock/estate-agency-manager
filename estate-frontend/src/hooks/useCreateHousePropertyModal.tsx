import { ResponsiveModal } from "../components/responsive-modal";
import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateHousePropertyModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-house-property",
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
