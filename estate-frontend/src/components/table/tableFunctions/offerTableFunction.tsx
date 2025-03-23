import { ColumnDef } from "@tanstack/react-table";
import { TableActionsOffer } from "../tableActionsOffer";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
export const offerFuntionButton : ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;
        return (
            <TableActionsOffer
                id={id}
                tradeType="jeonse"
                housePropertyId={row.original.houseProperty.id}
            >
                <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                >
                    <MoreVertical className="size-4" />
                </Button>
            </TableActionsOffer>
        );
    },
};
