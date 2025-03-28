import { ColumnDef } from "@tanstack/react-table";
import { headerFc } from "./tableFunctions/headerFunction";

export const userHistoryColumns: ColumnDef<any>[] = [
    {
        accessorKey: "user.name",
        header: "User",
    },
    {
        accessorKey: "tableName",
        header: "Table",
    },
    {
        accessorKey: "action",
        header: "Action",
    },
    {
        accessorKey: "recordId",
        header: "Record ID",
    },
    {
        accessorKey: "newData",
        header: ({ column }) => headerFc(column, "Updated Data"),
        cell: ({ row }) => {
            if (row.original.action == "UPDATE") {
                const newData = row.original.newData;
                if (!newData) return "-";
                const keys = Object.keys(newData);
                const values = Object.values(newData);
                return `${keys}: ${values}`;
            }
            if (row.original.action == "DELETE") {
                const oldData = row.original.oldData;
                if (!oldData) return "-";
                const keyValues = Object.entries(oldData)
                    .filter(
                        ([_, value]) =>
                            typeof value !== "object" || value === null
                    )
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");

                return keyValues;
            }
            if (row.original.action == "CREATE") {
                const newData = row.original.newData;
                if (!newData) return "-";
                // const keys = Object.keys(newData);
                // const values = Object.values(newData);
                const keyValues = Object.entries(newData)
                    .filter(
                        ([_, value]) =>
                            typeof value !== "object" || value === null
                    )
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");

                return keyValues;
            }
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => headerFc(column, "Date"),
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
];
