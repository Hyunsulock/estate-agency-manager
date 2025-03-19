"use client";
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
import { Building2, Building2Icon, ListCheckIcon } from "lucide-react";
import { HousePropertyStatus, tradeTypes } from "@/components/table/types";
import { useHousePropertyFilters } from "@/app/lib/useHousePropertyFilters";
import { DualSlider } from "@/components/ui/dualSlider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { RentSlider } from "./rentSlider";
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

    const [
        { status, tradeType, apartmentId, minDeposit, maxDeposit },
        setFilters,
    ] = useHousePropertyFilters();

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

    const onMinMaxDepositChange = (values: number[]) => {
        setFilters((prev) => ({
            ...prev,
            minDeposit: values[0],
            maxDeposit: values[1],
        }));
    };

    const onMinDepositChange = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            minDeposit: value,
        }));
    };

    const onMaxDepositChange = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            maxDeposit: value,
        }));
    };

    const [localValues, setLocalValues] = useState([0, 100000]);
    const [sizeValues, setSize] = useState([0, 330]);
    const [rentValues, setRent] = useState([0, 330]);
    const [value, setValue] = useState([0]);

    const handleValueChange = (newValues: any) => {
        setLocalValues(newValues);
    };

    const handleSizeValueChange = (newValues: any) => {
        setSize(newValues);
    };

    const handleRentValueChange = (newValues: any) => {
        setRent(newValues);
    };

    const handleOfferValueChange = (newValues: any) => {
        setValue(newValues);
    };

    if (isLoading) return null;

    return (
        <div>
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
                    className="w-full lg:w-40 h-8"
                    type="text"
                    placeholder="Building Number"
                />
                <Input
                    className="w-full lg:w-40 h-8"
                    type="text"
                    placeholder="Unit Number"
                />
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
                <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Price Range
                    </label>
                    <DualSlider
                        value={[minDeposit ?? 0, maxDeposit ?? 500000]}
                        minStepsBetweenThumbs={1}
                        max={500000}
                        min={1000}
                        step={1000}
                        onValueChange={onMinMaxDepositChange}
                        className={cn("w-full")}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={minDeposit ?? 0}
                                onChange={(e) =>
                                    onMinDepositChange(Number(e.target.value))
                                }
                            />
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={maxDeposit ?? 500000}
                                onChange={(e) =>
                                    onMaxDepositChange(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Size Range
                    </label>
                    <DualSlider
                        defaultValue={[0, 330]}
                        minStepsBetweenThumbs={1}
                        max={330}
                        min={0}
                        step={10}
                        onValueChange={handleSizeValueChange}
                        className={cn("w-full")}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={sizeValues[0]}
                                onChange={(e) =>
                                    setSize((prev) => [
                                        prev[0],
                                        Number(e.target.value),
                                    ])
                                }
                            />
                            {/* <li
                            key={0}
                            className="flex items-center justify-between w-full border px-3 h-10 rounded-md"
                        >
                            <span>Price</span>
                            <span>{localValues[0]}</span>
                        </li> */}
                            {/* <li
                            key={1}
                            className="flex items-center justify-between w-full border px-3 h-10 rounded-md"
                        >
                            <span>Price</span>
                            <span>{localValues[1]}</span>
                        </li> */}
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={sizeValues[1]}
                                onChange={(e) =>
                                    setSize((prev) => [
                                        prev[0],
                                        Number(e.target.value),
                                    ])
                                }
                            />
                            {/* {localValues.map((_, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between w-full border px-3 h-10 rounded-md"
                                >
                                    <span>Price</span>
                                    <span>{localValues[index]}</span>
                                </li>
                            ))} */}
                        </div>
                    </div>
                </div>
                <RentSlider />
                <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Offer Range
                    </label>
                    <Slider
                        value={value}
                        onValueChange={handleOfferValueChange}
                        max={100}
                        step={1}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={value[0]}
                                onChange={(e) =>
                                    setValue((prev) => [
                                        prev[0],
                                        Number(e.target.value),
                                    ])
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
