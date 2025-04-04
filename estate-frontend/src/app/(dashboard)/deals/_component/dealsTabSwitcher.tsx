"use client";
import {
    parseAsString,
    parseAsStringEnum,
    parseAsInteger,
    useQueryStates,
} from "nuqs";
import { useGetDealsQuery } from "@/app/lib/useGetFunctions/useGetDealsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dealsColumns } from "@/components/table/dealsColumns";
import { DataTable } from "@/components/table/dataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DealDataFilters } from "./dataFilterDeals";
import { useDealFilters } from "@/app/lib/useDealFilters";
import { tradeTypes } from "@/components/table/types";
import { useRouter } from "next/navigation";

export default function DealsTableSwitcher() {
    const [filters, setFilters] = useDealFilters();

    const { data: deals, isLoading } = useGetDealsQuery({
        ...filters,
    });

    const onTradeTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            tradeType: value as tradeTypes,
        }));
    };

    const router = useRouter();
    const handleRowClick = (row: any) => {
        router.push(`/deals/${row.id}`);
    };

    return (
        <div className="p-6">
            <Tabs value={filters.tradeType} onValueChange={onTradeTypeChange}>
                <TabsList className="mb-4">
                    <TabsTrigger value="sale">Sale</TabsTrigger>
                    <TabsTrigger value="jeonse">Jeonse</TabsTrigger>
                    <TabsTrigger value="rent">Rent</TabsTrigger>
                </TabsList>
                <DealDataFilters />
                <TabsContent value={filters.tradeType ?? "all"}>
                    {isLoading ? (
                        <div className="text-center py-8">Loading deals...</div>
                    ) : (
                        <DataTable
                            columns={dealsColumns}
                            data={deals || []}
                            onRowDoubleClick={handleRowClick}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
