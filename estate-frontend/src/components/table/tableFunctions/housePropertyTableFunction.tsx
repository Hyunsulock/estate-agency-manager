import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { TableActionsHouseProperty } from "../tableActionsHouseProperty";
import { HouseProperty } from "../types";
export const housePropertyFuntionButton: ColumnDef<HouseProperty> = {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;
        return (
            <TableActionsHouseProperty id={id}>
                <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                >
                    <MoreVertical className="size-4" />
                </Button>
            </TableActionsHouseProperty>
        );
    },
};
