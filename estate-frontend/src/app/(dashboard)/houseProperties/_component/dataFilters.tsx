"use client";
import { useGetApartments } from "@/app/lib/useGetFunctions/useGetApartments";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon } from "lucide-react";
import { HousePropertyStatus, tradeTypes } from "@/components/table/types";
import { useHousePropertyFilters } from "@/app/lib/useHousePropertyFilters";
interface DataFiltersProps {
    filters: {
        status?: HousePropertyStatus | null;
        tradeType?: tradeTypes | null;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            status?: HousePropertyStatus | null;
            tradeType?: tradeTypes | null;
        }>
    >;
}

// export const DataFilters = ({ filters, setFilters }: DataFiltersProps) => {
export const DataFilters = () => {
    const { data: apartments, isLoading: isLoadingApartments } =
        useGetApartments();

    const isLoading = isLoadingApartments;

    const apartmentOptions = apartments?.map((apartment: any) => ({
        value: apartment.id,
        label: apartment.name,
    }));

    const [{ status, tradeType, apartmentId }, setFilters] = useHousePropertyFilters();

    const onStatusChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            status: value === "all" ? null : (value as HousePropertyStatus),
        }));
        // if (value === "all") {
        //     setFilters({ status: null });
        // } else {
        //     setFilters({ status: value as HousePropertyStatus });
        // }
    };

        const onApartmentIdChange = (value: string) => {
            setFilters((prev) => ({
                ...prev,
                apartmentId: value === "all" ? null : value,
            }));
        };

    if (isLoading) return null;

    return (
        <div className="flex flex-col lg:flex-row gap-2 pt-4 pb-4">
            <Select
                defaultValue={status ?? undefined}
                onValueChange={(value) => onStatusChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-cetner pr-2">
                        <ListCheckIcon className="size-4 mr-2" />
                        <SelectValue placeholder="All values" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={HousePropertyStatus.ACTIVE}>
                        Active
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.TODO}>
                        Todo
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.FIND_OWNER}>
                        Found Owner
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.FIND_BUYER}>
                        Found Buyer
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.MATCHING}>
                        Matching
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.DEAL}>
                        Deal
                    </SelectItem>
                    <SelectItem value={HousePropertyStatus.DONE}>
                        Done
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select
                defaultValue={apartmentId ?? undefined}
                onValueChange={(value) => onApartmentIdChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-cetner pr-2">
                        <ListCheckIcon className="size-4 mr-2" />
                        <SelectValue placeholder="All apartments" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All apartments</SelectItem>
                    <SelectSeparator />
                    {
                        apartmentOptions?.map((apartment)=> (
                            <SelectItem key={apartment.value} value={apartment.value}>
                                {apartment.label}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    );
};
