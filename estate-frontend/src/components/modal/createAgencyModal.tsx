"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateHousePropertyForm } from "./createHousePropertyForm";
import { CreateAgencyForm } from "./createAgencyForm";

export const CreateAgencyModal = () => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-agency");

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateAgencyForm onCancel={close} />
        </ResponsiveModal>
    );
};
