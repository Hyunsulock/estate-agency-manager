import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Apartment } from "../apartmentColumns";
import { TableActionsApartment } from "../tableActionsApartment";

export const apartmentFuntionButton: ColumnDef<Apartment> = {
    id: "actions",
    cell: ({ row }) => {
        const id = row.original.id;
        return (
            <TableActionsApartment id={id}>
                <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                >
                    <MoreVertical className="size-4" />
                </Button>
            </TableActionsApartment>
        );
    },
};
