import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { headerFc } from "./tableFunctions/headerFunction";

export type Agency = {
    id: number;
    name: string;
    phoneNumber: string;
    location: string;
    createdAt: string;
};

export const agencyColumns: ColumnDef<Agency>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => headerFc(column, "Agency Name"),
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => headerFc(column, "Phone Number"),
        cell: ({ row }) => row.original.phoneNumber || "-",
    },
    {
        accessorKey: "location",
        header: ({ column }) => headerFc(column, "Location"),
        cell: ({ row }) => row.original.location || "-",
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => headerFc(column, "Created At"),
        cell: ({ row }) =>
            row.original.createdAt
                ? format(new Date(row.original.createdAt), "yyyy-MM-dd")
                : "-",
    },
];
