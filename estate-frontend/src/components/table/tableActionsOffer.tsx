"use client";
import { useDeleteHouseProperty } from "@/app/lib/useMutationFunctions/useDeleteHouseProperty";
import { useDeleteOffer } from "@/app/lib/useMutationFunctions/useDeleteOffer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useCreateModal } from "@/hooks/useCreateModal";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { TrashIcon, Upload } from "lucide-react";
import { CreateDealModal } from "../modal/createDealModal";

interface TableActionProps {
    id: number;
    housePropertyId: number;
    tradeType: string;
    children: React.ReactNode;
}

export const TableActionsOffer = ({
    id,
    housePropertyId,
    tradeType,
    children,
}: TableActionProps) => {
    const { confirm, ConfirmDialog } = useConfirm(
        "Delete Offer",
        "This action cannot be undone. This will permanently delete property information including a deal related to this offer"
    );

    const { mutate, isPending } = useDeleteOffer();

    const { open } = useCreateModal("create-deal");
    const onDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        mutate({ id, housePropertyId, tradeType });
    };

    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <CreateDealModal housePropertyId={housePropertyId} offerId={id} />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={onDelete}
                        disabled={isPending}
                        className="text-amber-700 foucs:text-amber-700 p-[9px] flex items-center"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={open}
                        disabled={isPending}
                        className="text-blue-800 foucs:text-blue-700 p-[9px] flex items-center"
                    >
                        <Upload className="size-4 mr-2 stroke-2" />
                        Make Deal
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
