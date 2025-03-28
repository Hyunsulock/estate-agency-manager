"use client";

import { useState } from "react";
import { useGetDealsQuery } from "@/app/lib/useGetFunctions/useGetDealsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dealsColumns } from "@/components/table/dealsColumns";
import { DataTable } from "@/components/table/dataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const tradeTypes = ["sale", "rent", "jeonse"] as const;

export default function DealRecentSwitcher() {
    const [activeType, setActiveType] = useState<"sale" | "rent" | "jeonse">(
        "sale"
    );
    const router = useRouter();

    const today = new Date();
    const tenDaysLater = new Date();
    tenDaysLater.setDate(today.getDate() + 10);

    const { data: deals, isLoading } = useGetDealsQuery({
        tradeType: activeType,
        dealDateStartRange: today.toISOString().split("T")[0],
        dealDateEndRange: tenDaysLater.toISOString().split("T")[0],
    });

    const handleRowClick = (row: any) => {
        router.push(`/deals/${row.id}`);
    };

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Deals (Next 10 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeType}
                        onValueChange={(val) => setActiveType(val as any)}
                    >
                        <TabsList className="mb-4">
                            {tradeTypes.map((type) => (
                                <TabsTrigger key={type} value={type}>
                                    {type.toUpperCase()}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value={activeType}>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    Loading deals...
                                </div>
                            ) : (
                                <DataTable
                                    columns={dealsColumns}
                                    data={deals || []}
                                    onRowDoubleClick={handleRowClick}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
