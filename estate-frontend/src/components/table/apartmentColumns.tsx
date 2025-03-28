import { ColumnDef } from "@tanstack/react-table";
import { apartmentFuntionButton } from "./tableFunctions/apartmentTableFunction";

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
        header: "Name",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "bulidingYear",
        header: "BulidingYear",
    },
    {
        accessorKey: "parking",
        header: "Parking",
    },
    {
        accessorKey: "createdAt",
        header: "Parking",
    },
    apartmentFuntionButton,
];
