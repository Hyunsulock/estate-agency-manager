import { useDeleteHouseProperty } from "@/app/lib/useMutationFunctions/useDeleteHouseProperty";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

import { Pencil1Icon } from "@radix-ui/react-icons";
import {
    ExternalLink,
    ExternalLinkIcon,
    PencilIcon,
    TrashIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface TableActionProps {
    id: number;
    children: React.ReactNode;
}

export const TableActionsHouseProperty = ({
    id,
    children,
}: TableActionProps) => {
    const { confirm, ConfirmDialog } = useConfirm(
        "Delete Property",
        "This action cannot be undone. This will permanently delete property information including offers related to this property"
    );

    const { mutate, isPending } = useDeleteHouseProperty();
    const onDelete = async () => {
        console.log("hello delete");
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
