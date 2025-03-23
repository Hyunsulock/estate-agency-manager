import { ColumnDef } from "@tanstack/react-table";
import { TableActionsOffer } from "./tableActionsOffer";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { offerFuntionButton } from "./tableFunctions/offerTableFunction";

export const offerJeonseColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "jeonseDeposit", header: "Jeonse Deposit" },
    { accessorKey: "keyFeatures", header: "Key Features" },
    { accessorKey: "agency.name", header: "Agency" },
    offerFuntionButton
];
