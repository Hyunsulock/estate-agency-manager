"use client";

import { ResponsiveModal } from "../responsive-modal";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateCustomerForm } from "./createCustomerForm";
import { CreateDealForm } from "./createDealForm";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { useGetCustomersQuery } from "@/app/lib/useGetFunctions/useGetCustomersQuery";

interface CreateDealModalProps {
    housePropertyId: number;
    offerId: number;
}

export const CreateDealModal = ({
    housePropertyId,
    offerId,
}: CreateDealModalProps) => {
    const { isOpen, setIsOpen, close } = useCreateModal("create-deal");
    const { data: agencies } = useGetAgencies();

    const { data: customers, isLoading: customerLoading } =
        useGetCustomersQuery({
            name: null,
            phoneNumber: null,
            intro: null,
        });

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateDealForm
                onCancel={close}
                housePropertyId={housePropertyId}
                offerId={offerId}
                agencies={agencies}
                customers={customers}
            />
        </ResponsiveModal>
    );
};
