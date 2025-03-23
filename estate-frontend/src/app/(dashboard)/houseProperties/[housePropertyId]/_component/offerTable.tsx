"use client";
import { DataTable } from "@/components/table/dataTable";
import { offerJeonseColumns } from "@/components/table/offerJeonseColumns";
import { offerRentColumns } from "@/components/table/offerRentColumns";
import { offerSaleColumns } from "@/components/table/offerSaleColumns";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface OfferTableProps {
    offers: any[];
    isLoading: boolean;
    tradeType: string;
}

export const OfferTable = ({
    offers,
    isLoading,
    tradeType,
}: OfferTableProps) => {
    const getColumns = () => {
        if (tradeType === "sale") return offerSaleColumns;
        if (tradeType === "jeonse") return offerJeonseColumns;
        if (tradeType === "rent") return offerRentColumns;
        return offerSaleColumns; // fallback
    };

    if (isLoading) {
        return (
            <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }
    const router = useRouter();
    const handleRowClick = (row: any) => {
        router.push(
            `/houseProperties/${row.houseProperty.id}/offers/${row.id}`
        );
        console.log("row", row);
    };

    return (
        <DataTable
            columns={getColumns()}
            data={offers}
            onRowDoubleClick={handleRowClick}
        />
    );
};
