import { ColumnDef } from "@tanstack/react-table";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";
import { StatusSelectOffer } from "./selectOfferStatus";

export const offerSaleColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const currentStatus = row.original.status; // Get current status from row
            const id = row.original.id;
            return (
                <>
                    <StatusSelectOffer id={id} currentStatus={currentStatus} />
                </>
            );
        },
    },
    { accessorKey: "salePrice", header: "Sale Price" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton,
];
