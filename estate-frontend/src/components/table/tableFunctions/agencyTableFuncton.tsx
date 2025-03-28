import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { TableActionsAgency } from "../tableActionAgency";
import { Agency } from "../agencyColumns";

export const agencyFuntionButton: ColumnDef<Agency> = {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;
        return (
            <TableActionsAgency id={id}>
                <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                >
                    <MoreVertical className="size-4" />
                </Button>
            </TableActionsAgency>
        );
    },
};
