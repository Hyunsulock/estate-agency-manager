"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateHousePropertyForm } from "./createHousePropertyForm";
import { CreateAgencyForm } from "./createAgencyForm";
import { CreateCustomerForm } from "./createCustomerForm";

export const CreateCustomerModal = () => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-customer");

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateCustomerForm onCancel={close} />
        </ResponsiveModal>
    );
};
