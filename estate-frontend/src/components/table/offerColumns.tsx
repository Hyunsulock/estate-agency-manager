"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HouseProperty } from "./types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

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

export const jeonseColumns: ColumnDef<HouseProperty>[] = [
    {
        accessorKey: "tradeType",
        header: ({ column }) => headerFc(column, "Trade Type"),
    },
    {
        accessorKey: "status",
        header: ({ column }) => headerFc(column, "Status"),
    },
    {
        accessorKey: "status",
        header: ({ column }) => headerFc(column, "Status"),
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
        accessorKey: "minjeonsedeposit",
        header: ({ column }) => headerFc(column, "MinDeposit"),
    },
    {
        accessorKey: "maxjeonsedeposit",
        header: ({ column }) => headerFc(column, "MaxDeposit"),
    },
    {
        accessorKey: "offercount",
        header: ({ column }) => headerFc(column, "Offers"),
    },
];
