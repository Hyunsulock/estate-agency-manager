import { ColumnDef } from "@tanstack/react-table";
import { dealFuntionButton } from "./tableFunctions/dealTableFunction";

export const dealsColumns: ColumnDef<any>[] = [
    {
        accessorKey: "houseProperty.apartment.name",
        header: "Apartment",
        cell: ({ row }) => row.original.houseProperty?.apartment?.name ?? "-",
    },
    {
        accessorKey: "houseProperty.buildingNumber",
        header: "Building No.",
        cell: ({ row }) => row.original.houseProperty?.buildingNumber ?? "-",
    },
    {
        accessorKey: "houseProperty.unitNumber",
        header: "Unit No.",
        cell: ({ row }) => row.original.houseProperty?.unitNumber ?? "-",
    },
    {
        accessorKey: "buyer.name",
        header: "Buyer",
        cell: ({ row }) => row.original.buyer?.name ?? "-",
    },
    {
        accessorKey: "seller.name",
        header: "Seller",
        cell: ({ row }) => row.original.seller?.name ?? "-",
    },
    {
        accessorKey: "sellAgency.name",
        header: "Seller Agency",
        cell: ({ row }) => row.original.sellAgency?.name ?? "-",
    },
    {
        accessorKey: "buyAgency.name",
        header: "Buyer Agency",
        cell: ({ row }) => row.original.buyAgency?.name ?? "-",
    },
    {
        accessorKey: "dealDate",
        header: "Deal Date",
        cell: ({ row }) =>
            row.original.dealDate
                ? new Date(row.original.dealDate).toLocaleDateString()
                : "-",
    },
    {
        accessorKey: "dealer.name",
        header: "Dealer",
        cell: ({ row }) => row.original.dealer.name ?? "-",
    },
    dealFuntionButton,
];
