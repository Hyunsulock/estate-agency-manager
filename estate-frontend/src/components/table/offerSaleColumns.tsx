import { ColumnDef } from "@tanstack/react-table";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";

export const offerSaleColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "salePrice", header: "Sale Price" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton,
];
