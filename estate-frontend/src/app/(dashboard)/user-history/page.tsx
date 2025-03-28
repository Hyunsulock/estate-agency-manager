"use client";
import { useGetHistoriesQuery } from "@/app/lib/useGetFunctions/useGetHistoriesQuery";
import { useUserHistoryFilters } from "@/app/lib/useUserHistoryFilters";

import { DataTable } from "@/components/table/dataTable";
import { userHistoryColumns } from "@/components/table/userHistoryColumns";
import { FilterUserHistories } from "./_component/userHistoriesFilter";

export default function UserHistoriesPage() {
    const [filters] = useUserHistoryFilters();
    const { data: histories, isLoading } = useGetHistoriesQuery(filters);

    const handleRowClick = (row: any) => {
        console.log(row);
    };

    return (
        <div className="p-6">
            <FilterUserHistories />
            {isLoading ? (
                <div className="text-center py-8">Loading histories...</div>
            ) : (
                <DataTable
                    onRowDoubleClick={handleRowClick}
                    columns={userHistoryColumns}
                    data={histories || []}
                />
            )}
        </div>
    );
}
