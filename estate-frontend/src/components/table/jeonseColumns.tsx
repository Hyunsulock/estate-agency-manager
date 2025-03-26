"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HouseProperty } from "./types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { housePropertyFuntionButton } from "./tableFunctions/housePropertyTableFunction";
import { StatusSelect } from "./statusSelect";
import { headerFc } from "./tableFunctions/headerFunction";



export const jeonseColumns: ColumnDef<HouseProperty>[] = [
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
    housePropertyFuntionButton,
];
