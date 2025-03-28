"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";
import { useUserHistoryFilters } from "@/app/lib/useUserHistoryFilters";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";

const actions = ["CREATE", "UPDATE", "DELETE"];
const tableOptions = ["agencies", "offers", "deals", "houseProperties"];

export const FilterUserHistories = () => {
    const [filters, setFilters] = useUserHistoryFilters();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: filters.userHistoryDateStartRange
            ? new Date(filters.userHistoryDateStartRange)
            : undefined,
        to: filters.userHistoryDateEndRange
            ? new Date(filters.userHistoryDateEndRange)
            : undefined,
    });

    const { data: users, isLoading } = useGetUsers();

    const onBlurCommit = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || null,
        }));
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        setFilters((prev) => ({
            ...prev,
            userHistoryDateStartRange: range?.from
                ? range.from.toISOString().split("T")[0]
                : null,
            userHistoryDateEndRange: range?.to
                ? range.to.toISOString().split("T")[0]
                : null,
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Table name select */}
            <Select
                value={filters.tableName ?? "all"}
                onValueChange={(value) =>
                    setFilters((prev) => ({
                        ...prev,
                        tableName: value === "all" ? null : value,
                    }))
                }
            >
                <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All tables</SelectItem>
                    {tableOptions.map((table) => (
                        <SelectItem key={table} value={table}>
                            {table}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* User select */}
            <Select
                value={filters.userId?.toString() ?? "all"}
                onValueChange={(value) =>
                    setFilters((prev) => ({
                        ...prev,
                        userId: value === "all" ? null : Number(value),
                    }))
                }
            >
                <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All users</SelectItem>
                    {!isLoading &&
                        users?.map((user: any) => (
                            <SelectItem
                                key={user.id}
                                value={user.id.toString()}
                            >
                                {user.name} ({user.email})
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>

            {/* Record ID input */}
            <Input
                className="w-full h-10"
                type="number"
                placeholder="Record ID"
                value={filters.recordId ?? ""}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        recordId: Number(e.target.value),
                    }))
                }
                onBlur={(e) =>
                    onBlurCommit(
                        "recordId",
                        e.target.value ? Number(e.target.value) : null
                    )
                }
            />

            {/* Action select */}
            <Select
                value={filters.action ?? "all"}
                onValueChange={(value) =>
                    setFilters((prev) => ({
                        ...prev,
                        action: value === "all" ? null : value,
                    }))
                }
            >
                <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                            {action}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Date range picker */}
            <DatePickerWithRange
                className="w-full"
                initialDateRange={dateRange}
                onSelectDateRange={handleDateRangeChange}
            />
        </div>
    );
};
