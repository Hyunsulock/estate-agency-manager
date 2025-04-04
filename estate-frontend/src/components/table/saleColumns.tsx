"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { HouseProperty } from "./types";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { TableActionsHouseProperty } from "./tableActionsHouseProperty";
import { StatusSelect } from "./statusSelect";
import { housePropertyFuntionButton } from "./tableFunctions/housePropertyTableFunction";
import { headerFc } from "./tableFunctions/headerFunction";



export const columns: ColumnDef<HouseProperty>[] = [
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
        accessorKey: "minsaleprice",
        header: ({ column }) => headerFc(column, "minPrice"),
    },
    {
        accessorKey: "maxsaleprice",
        header: ({ column }) => headerFc(column, "maxPrice"),
    },
    {
        accessorKey: "offercount",
        header: ({ column }) => headerFc(column, "Offers"),
    },
    housePropertyFuntionButton
];
