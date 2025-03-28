import { ColumnDef } from "@tanstack/react-table";
import { customerFuntionButton } from "./tableFunctions/customerTableFunction";

export type Customer = {
    id: number;
    name: string;
    phoneNumber: string;
    intro: string;
    createdAt: string;
};
// customerColumns.ts
export const customerColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "intro",
        header: "Intro",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(),
    },
    customerFuntionButton,
];
