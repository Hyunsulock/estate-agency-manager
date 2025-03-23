import { ColumnDef } from "@tanstack/react-table";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";

export const offerRentColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "rentDeposit", header: "Rent Deposit" },
    { accessorKey: "rentPrice", header: "Rent Price" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton,
];
