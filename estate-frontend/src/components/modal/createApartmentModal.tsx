"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateApartmentForm } from "./createApartmentForm";

export const CreateApartmentModal = () => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-apartment");

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateApartmentForm onCancel={close} />
        </ResponsiveModal>
    );
};
