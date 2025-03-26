"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateCustomerForm } from "./createCustomerForm";
import { CreateDealForm } from "./createDealForm";

interface CreateDealModalProps {
    housePropertyId: number;
    offerId: number;
}

export const CreateDealModal = ({ housePropertyId, offerId }: CreateDealModalProps) => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-deal");

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateDealForm onCancel={close} housePropertyId={housePropertyId} offerId={offerId}/>
        </ResponsiveModal>
    );
};
