import { ColumnDef } from "@tanstack/react-table";
import { TableActionsOffer } from "../tableActionsOffer";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const offerFuntionButton: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;
        return (
            <TableActionsOffer
                id={id}
                tradeType="jeonse"
                housePropertyId={row.original.houseProperty.id}
            >
                <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
                    <MoreVertical className="size-4" />
                </Button>
            </TableActionsOffer>
        );
    },
};
