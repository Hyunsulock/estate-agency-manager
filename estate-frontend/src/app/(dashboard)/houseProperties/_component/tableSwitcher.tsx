"use client";
import { useGetHouseProperties } from "@/app/lib/useGetFunctions/useGetHouseProperties";
import { columns } from "@/components/table/saleColumns";
import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useQueryState } from "nuqs";
import { useHousePropertyFilters } from "@/app/lib/useHousePropertyFilters";
import { useEffect, useState } from "react";
import { HousePropertyStatus, tradeTypes } from "@/components/table/types";
import { DataFilters } from "./dataFilters";
import { jeonseColumns } from "@/components/table/jeonseColumns";
import { rentColumns } from "@/components/table/rentColumns";
import { DualSlider } from "@/components/ui/dualSlider";
import { cn } from "@/lib/utils";
interface UseGetHousePropertiesProps {
    status?: HousePropertyStatus | null;
    tradeType?: tradeTypes | null;
}
export const TableSwitcher = () => {
    const [
        { status, tradeType, apartmentId, minDeposit, maxDeposit },
        setFilters,
    ] = useHousePropertyFilters();
    // const [filters, setFilters] = useState<UseGetHousePropertiesProps>({
    //     status: null ,
    //     tradeType: null,
    // });
    const { data: houseProperties, isLoading: isLoadingHouseProperty } =
        // useGetHouseProperties({...filters});
        useGetHouseProperties({
            status,
            tradeType,
            apartmentId,
            // minDeposit,
            // maxDeposit,
        });


    const onTradeTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            tradeType: value as tradeTypes,
        }));
    };
    const router = useRouter();

    const handleRowClick = (row: any) => {
        router.push(`/houseProperties/${row.id}`);
        console.log(row.id);
    };

    return (
        <Tabs
            value={tradeType}
            onValueChange={onTradeTypeChange}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="sale"
                        >
                            Sale
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="jeonse"
                        >
                            Jeonse
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="rent"
                        >
                            Rent
                        </TabsTrigger>
                    </TabsList>
                    <Button size="sm" className="w-full lg:w-auto">
                        <PlusIcon className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                {/* <DataFilters filters={filters} setFilters={setFilters}/> */}
                <DataFilters />

                {isLoadingHouseProperty ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="sale" className="mt-0">
                            <DataTable
                                columns={columns}
                                data={houseProperties}
                                onRowDoubleClick={handleRowClick}
                            />
                        </TabsContent>
                        <TabsContent value="jeonse" className="mt-0">
                            <DataTable
                                columns={jeonseColumns}
                                data={houseProperties}
                                onRowDoubleClick={handleRowClick}
                            />
                        </TabsContent>
                        <TabsContent value="rent" className="mt-0">
                            <DataTable
                                columns={rentColumns}
                                data={houseProperties}
                                onRowDoubleClick={handleRowClick}
                            />
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};
