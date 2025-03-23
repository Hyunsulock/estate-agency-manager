"use client";
import { useDeleteHouseProperty } from "@/app/lib/useMutationFunctions/useDeleteHouseProperty";
import { useDeleteOffer } from "@/app/lib/useMutationFunctions/useDeleteOffer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { TrashIcon } from "lucide-react";

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
        "Delete Property",
        "This action cannot be undone. This will permanently delete property information including offers related to this property"
    );

    const { mutate, isPending } = useDeleteOffer();
    const onDelete = async () => {
        console.log("hello delete offer id", id);
        const ok = await confirm();
        console.log(ok);
        if (!ok) return;
        mutate({ id, housePropertyId, tradeType });
    };
    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                        onClick={onDelete}
                        disabled={isPending}
                        className="text-amber-700 foucs:text-amber-700 p-[9px] flex items-center"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
