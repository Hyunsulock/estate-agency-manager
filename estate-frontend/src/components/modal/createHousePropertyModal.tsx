'use client';

import { ResponsiveModal } from "../responsive-modal";

import { useCreateHousePropertyModal } from "@/hooks/useCreateHousePropertyModal";
import { CreateHousePropertyForm } from "./createHousePropertyForm";

export const CreateHousePropertyModal = () => {
    const {isOpen, setIsOpen, close } =useCreateHousePropertyModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateHousePropertyForm onCancel={close}/>
        </ResponsiveModal>
    )
}