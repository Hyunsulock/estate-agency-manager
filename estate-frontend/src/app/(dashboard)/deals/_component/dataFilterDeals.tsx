import { useDealFilters } from "@/app/lib/useDealFilters";
import { useGetApartments } from "@/app/lib/useGetFunctions/useGetApartments";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Building2Icon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";

export const DealDataFilters = () => {
    const { data: apartments, isLoading } = useGetApartments();
    const [filters, setFilters] = useDealFilters();

    const apartmentOptions = apartments?.map((apartment: any) => ({
        value: apartment.id,
        label: apartment.name,
    }));

    const [localBuildingNumber, setLocalBuildingNumber] = useState(
        filters.buildingNumber ?? ""
    );
    const [localUnitNumber, setLocalUnitNumber] = useState(
        filters.unitNumber ?? ""
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: filters.dealDateStartRange
            ? new Date(filters.dealDateStartRange)
            : undefined,
        to: filters.dealDateEndRange
            ? new Date(filters.dealDateEndRange)
            : undefined,
    });

    const onApartmentChange = (value: string) => {
        setFilters((prev: any) => ({
            ...prev,
            apartmentId: value === "all" ? null : value,
        }));
    };

    const onBlurCommit = (key: string, value: any) => {
        setFilters((prev: any) => ({
            ...prev,
            [key]: value || null,
        }));
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from) {
            setFilters((prev: any) => ({
                ...prev,
                dealDateStartRange: range.from?.toISOString().split("T")[0],
            }));
        }
        if (range?.to) {
            setFilters((prev: any) => ({
                ...prev,
                dealDateEndRange: range.to?.toISOString().split("T")[0],
            }));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Select
                defaultValue={filters.apartmentId ?? undefined}
                onValueChange={onApartmentChange}
            >
                <SelectTrigger className="w-full h-10">
                    <div className="flex items-center pr-2">
                        <Building2Icon className="size-4 mr-2" />
                        <SelectValue placeholder="All apartments" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All apartments</SelectItem>
                    <SelectSeparator />
                    {apartmentOptions?.map((apartment: any) => (
                        <SelectItem
                            key={apartment.value}
                            value={apartment.value}
                        >
                            {apartment.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                className="w-full h-10"
                type="number"
                placeholder="Building Number"
                value={localBuildingNumber}
                onChange={(e) => setLocalBuildingNumber(e.target.value)}
                onBlur={() =>
                    onBlurCommit(
                        "buildingNumber",
                        localBuildingNumber ? Number(localBuildingNumber) : null
                    )
                }
            />

            <Input
                className="w-full h-10"
                type="number"
                placeholder="Unit Number"
                value={localUnitNumber}
                onChange={(e) => setLocalUnitNumber(e.target.value)}
                onBlur={() =>
                    onBlurCommit(
                        "unitNumber",
                        localUnitNumber ? Number(localUnitNumber) : null
                    )
                }
            />

            <Input
                className="w-full h-10"
                placeholder="Buyer Name"
                value={filters.buyerName ?? ""}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        buyerName: e.target.value,
                    }))
                }
                onBlur={(e) => onBlurCommit("buyerName", e.target.value)}
            />

            <Input
                className="w-full h-10"
                placeholder="Seller Name"
                value={filters.sellerName ?? ""}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        sellerName: e.target.value,
                    }))
                }
                onBlur={(e) => onBlurCommit("sellerName", e.target.value)}
            />

            <Input
                className="w-full h-10"
                placeholder="Seller Agency"
                value={filters.sellerAgencyName ?? ""}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        sellerAgencyName: e.target.value,
                    }))
                }
                onBlur={(e) => onBlurCommit("sellerAgencyName", e.target.value)}
            />

            <Input
                className="w-full h-10"
                placeholder="Buyer Agency"
                value={filters.buyerAgencyName ?? ""}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        buyerAgencyName: e.target.value,
                    }))
                }
                onBlur={(e) => onBlurCommit("buyerAgencyName", e.target.value)}
            />

            <DatePickerWithRange
                className="w-full"
                initialDateRange={dateRange}
                onSelectDateRange={handleDateRangeChange}
            />
        </div>
    );
};
