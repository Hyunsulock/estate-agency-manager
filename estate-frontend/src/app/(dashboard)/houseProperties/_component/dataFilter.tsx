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
import { RangeSliderFilter } from "./rangeSliderFilter";

export const DataFilters = () => {
    const { data: apartments, isLoading: isLoadingApartments } =
        useGetApartments();

    const isLoading = isLoadingApartments;

    const apartmentOptions = apartments?.map((apartment: any) => ({
        value: apartment.id,
        label: apartment.name,
    }));

    const [
        {
            status,
            tradeType,
            apartmentId,
            minRent,
            maxRent,
            minDeposit,
            maxDeposit,
            minSize,
            maxSize,
            offerCount,
            unitNumber,
            buildingNumber,
        },
        setFilters,
    ] = useHousePropertyFilters();

    const onStatusChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            status: value === "all" ? null : (value as HousePropertyStatus),
        }));
    };

    const onApartmentIdChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            apartmentId: value === "all" ? null : value,
        }));
    };

    // const onMinMaxDepositChange = (values: number[]) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         minDeposit: values[0],
    //         maxDeposit: values[1],
    //     }));
    // };

    // const [localDepositRange, setLocalDepositRange] = useState<
    //     [number, number]
    // >([minDeposit ?? 0, maxDeposit ?? 500000]);

    // const handleDepositChange = (newValues: any) => {
    //     setLocalDepositRange(newValues);
    // };

    // const onMinDepositChange = (value: number) => {
    //     setLocalDepositRange((prev) => [value, prev[1]]);
    //     setFilters((prev) => ({
    //         ...prev,
    //         minDeposit: value,
    //     }));
    // };

    // const onMaxDepositChange = (value: number) => {
    //     setLocalDepositRange((prev) => [prev[0], value]);
    //     setFilters((prev) => ({
    //         ...prev,
    //         maxDeposit: value,
    //     }));
    // };

    // const onMinMaxSizeChange = (values: number[]) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         minSize: values[0],
    //         maxSize: values[1],
    //     }));
    // };

    // const onMinSizeChange = (value: number) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         minSize: value,
    //     }));
    // };

    // const onMaxSizeChange = (value: number) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         maxSize: value,
    //     }));
    // };

    const [buildingNumberInput, setBuildingNumberInput] = useState(
        buildingNumber ?? ""
    );
    const [unitNumberInput, setUnitNumberInput] = useState(unitNumber ?? "");

    const onOfferCountChange = (value: number[]) => {
        setFilters((prev) => ({
            ...prev,
            offerCount: value[0],
        }));
    };

    const onBuildingNumberChange = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            buildingNumber: value === 0 ? undefined : value,
        }));
    };

    const onUnitNumberChange = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            unitNumber: value === 0 ? undefined : value,
        }));
    };

    const [localOfferCount, setLocalOfferCount] = useState<number>(
        offerCount ?? 0
    );

    const handleOfferChange = (values: number[]) => {
        setLocalOfferCount(values[0]);
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
                    type="number"
                    placeholder="Building Number"
                    value={buildingNumberInput}
                    onChange={(e) => setBuildingNumberInput(e.target.value)}
                    onBlur={() =>
                        onBuildingNumberChange(
                            buildingNumberInput
                                ? Number(buildingNumberInput)
                                : 0
                        )
                    }
                />

                <Input
                    className="w-full lg:w-40 h-8"
                    type="number"
                    placeholder="Unit Number"
                    value={unitNumberInput}
                    onChange={(e) => setUnitNumberInput(e.target.value)}
                    onBlur={() =>
                        onUnitNumberChange(
                            unitNumberInput ? Number(unitNumberInput) : 0
                        )
                    }
                />
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
                <RangeSliderFilter
                    label="Deposit Range"
                    min={1000}
                    max={500000}
                    step={1000}
                    minValue={minDeposit ?? 0}
                    maxValue={maxDeposit ?? 500000}
                    onRangeCommit={(values) =>
                        setFilters((prev) => ({
                            ...prev,
                            minDeposit: values[0],
                            maxDeposit: values[1],
                        }))
                    }
                    tradeTypeValue={tradeType}
                />
                {/* <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Price/Deposit Range
                    </label>
                    <DualSlider
                        value={localDepositRange}
                        minStepsBetweenThumbs={1}
                        max={500000}
                        min={1000}
                        step={1000}
                        onValueChange={handleDepositChange}
                        onValueCommit={onMinMaxDepositChange}
                        className={cn("w-full")}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={localDepositRange[0]}
                                onChange={(e) =>
                                    setLocalDepositRange((prev) => [
                                        Number(e.target.value),
                                        prev[1],
                                    ])
                                }
                                onBlur={(e) =>
                                    onMinDepositChange(Number(e.target.value))
                                }
                            />
                            <Input
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={localDepositRange[1]}
                                onChange={(e) =>
                                    setLocalDepositRange((prev) => [
                                        prev[0],
                                        Number(e.target.value),
                                    ])
                                }
                                onBlur={(e) =>
                                    onMaxDepositChange(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div> */}
                {/* <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Size Range mSquere
                    </label>
                    <DualSlider
                        value={[minSize ?? 0, maxSize ?? 330]}
                        minStepsBetweenThumbs={1}
                        max={330}
                        min={0}
                        step={10}
                        onValueChange={onMinMaxSizeChange}
                        className={cn("w-full")}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={minSize ?? 0}
                                onChange={(e) =>
                                    onMinSizeChange(Number(e.target.value))
                                }
                            />
                            <Input
                                aria-label="min"
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={maxSize ?? 0}
                                onChange={(e) =>
                                    onMaxSizeChange(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div> */}

                <RangeSliderFilter
                    label="Size Range (㎡)"
                    min={0}
                    max={330}
                    step={10}
                    minValue={minSize ?? 0}
                    maxValue={maxSize ?? 330}
                    onRangeCommit={(values: number[]) =>
                        setFilters((prev) => ({
                            ...prev,
                            minSize: values[0],
                            maxSize: values[1],
                        }))
                    }
                    tradeTypeValue={tradeType}
                />
                {/* <RentSlider /> */}
                <RangeSliderFilter
                    label="Rent Range"
                    min={0}
                    max={4000}
                    step={5}
                    minValue={minRent ?? 0}
                    maxValue={maxRent ?? 4000}
                    onRangeCommit={(values: number[]) =>
                        setFilters((prev) => ({
                            ...prev,
                            minRent: values[0],
                            maxRent: values[1],
                        }))
                    }
                    tradeTypeValue={tradeType}
                />
                <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Offer Range
                    </label>
                    <Slider
                        value={[localOfferCount]}
                        onValueChange={handleOfferChange}
                        onValueCommit={onOfferCountChange}
                        max={30}
                        step={1}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center w-full gap-3">
                            <Input
                                className="h-8"
                                type="number"
                                placeholder="price"
                                value={localOfferCount}
                                onChange={(e) =>
                                    handleOfferChange([Number(e.target.value)])
                                }
                                onBlur={() =>
                                    onOfferCountChange([localOfferCount])
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
