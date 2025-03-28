import { useDeleteAgency } from "@/app/lib/useMutationFunctions/useDeleteAgency";
import { useDeleteApartment } from "@/app/lib/useMutationFunctions/useDeleteApartment";
import { useDeleteDeals } from "@/app/lib/useMutationFunctions/useDeleteDeal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";


import {
    TrashIcon,
} from "lucide-react";


interface TableActionProps {
    id: number;
    children: React.ReactNode;
}

export const TableActionsApartment = ({
    id,
    children,
}: TableActionProps) => {
    const { confirm, ConfirmDialog } = useConfirm(
        "Delete Apartment",
        "This action cannot be undone. This will permanently delete apartment information with related data"
    );

    const { mutate, isPending } = useDeleteApartment();
    const onDelete = async () => {
        const ok = await confirm();
        console.log(ok);
        if (!ok) return;
        mutate({ id });
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
