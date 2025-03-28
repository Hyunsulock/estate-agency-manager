import { ColumnDef } from "@tanstack/react-table";
import { apartmentFuntionButton } from "./tableFunctions/apartmentTableFunction";
import { headerFc } from "./tableFunctions/headerFunction";
import { format } from "date-fns";
export type Apartment = {
    id: number;
    name: string;
    address: string;
    createdAt: string;
    bulidingYear: string;
    parking: string;
};

export const apartmentColumns: ColumnDef<Apartment>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => headerFc(column, "Name"),
    },
    {
        accessorKey: "address",
        header: ({ column }) => headerFc(column, "Address"),
    },
    {
        accessorKey: "buildingYear",
        header: ({ column }) => headerFc(column, "BuildingYear"),
    },
    {
        accessorKey: "parking",
        header: ({ column }) => headerFc(column, "Parking"),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => headerFc(column, "CreatedAt"),
        cell: ({ row }) =>
            row.original.createdAt
                ? format(new Date(row.original.createdAt), "yyyy-MM-dd")
                : "-",
    },
    apartmentFuntionButton,
];
