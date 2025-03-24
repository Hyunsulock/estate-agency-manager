"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HouseProperty } from "./types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { housePropertyFuntionButton } from "./tableFunctions/housePropertyTableFunction";
import { StatusSelect } from "./statusSelect";

function headerFc(column: any, name: string) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export const rentColumns: ColumnDef<HouseProperty>[] = [
    {
        accessorKey: "apartmentname",
        header: ({ column }) => headerFc(column, "Apartment"),
    },
    {
        accessorKey: "size",
        header: ({ column }) => headerFc(column, "Size"),
    },
    {
        accessorKey: "status",
        header: ({ column }) => headerFc(column, "Status"),
        cell: ({ row }) => {
            const currentStatus = row.original.status; // Get current status from row
            const id = row.original.id;
            return (
                <>
                    <StatusSelect id={id} currentStatus={currentStatus} />
                </>
            );
        },
    },
    {
        accessorKey: "buildingnumber",
        header: ({ column }) => headerFc(column, "Building"),
    },
    {
        accessorKey: "floor",
        header: ({ column }) => headerFc(column, "Floor"),
    },
    {
        accessorKey: "unitnumber",
        header: ({ column }) => headerFc(column, "Unit"),
    },
    {
        accessorKey: "minrentprice",
        header: ({ column }) => headerFc(column, "MinRent"),
    },
    {
        accessorKey: "maxrentprice",
        header: ({ column }) => headerFc(column, "MaxRent"),
    },
    {
        accessorKey: "minrentdeposit",
        header: ({ column }) => headerFc(column, "MinDep"),
    },
    {
        accessorKey: "maxrentdeposit",
        header: ({ column }) => headerFc(column, "MaxDep"),
    },
    {
        accessorKey: "offercount",
        header: ({ column }) => headerFc(column, "Offers"),
    },
    housePropertyFuntionButton,
];
