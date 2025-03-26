"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateOfferForm } from "./createOfferForm";

export const CreateOfferModal = ({
    housePropertyId,
}: {
    housePropertyId: number;
}) => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-offer");

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateOfferForm
                onCancel={close}
                housePropertyId={housePropertyId}
            />
        </ResponsiveModal>
    );
};
