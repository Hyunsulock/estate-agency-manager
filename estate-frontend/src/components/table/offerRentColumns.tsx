import { ColumnDef } from "@tanstack/react-table";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";
import { StatusSelectOffer } from "./selectOfferStatus";

export const offerRentColumns: ColumnDef<any>[] = [
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
    { accessorKey: "rentDeposit", header: "Rent Deposit" },
    { accessorKey: "rentPrice", header: "Rent Price" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton,
];
