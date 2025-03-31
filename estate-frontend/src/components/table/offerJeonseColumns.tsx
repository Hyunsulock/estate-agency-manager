import { ColumnDef } from "@tanstack/react-table";
import { TableActionsOffer } from "./tableActionsOffer";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";
import { StatusSelectOffer } from "./selectOfferStatus";

export const offerJeonseColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const currentStatus = row.original.status; 
            const id = row.original.id;
            return (
                <>
                    <StatusSelectOffer id={id} currentStatus={currentStatus} />
                </>
            );
        },
    },
    { accessorKey: "jeonseDeposit", header: "Jeonse Deposit" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton
];
