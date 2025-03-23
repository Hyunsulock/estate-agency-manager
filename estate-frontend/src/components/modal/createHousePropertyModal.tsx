'use client';

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateHousePropertyModal";
import { CreateHousePropertyForm } from "./createHousePropertyForm";

export const CreateHousePropertyModal = () => {
    const { isOpen, setIsOpen, close } = useCreateModal(
        "create-house-property"
    );

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateHousePropertyForm onCancel={close}/>
        </ResponsiveModal>
    )
}