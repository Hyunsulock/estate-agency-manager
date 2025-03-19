"use client";
import { useHousePropertyFilters } from "@/app/lib/useHousePropertyFilters";
import { tradeTypes } from "@/components/table/types";
import { DualSlider } from "@/components/ui/dualSlider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const RentSlider = () => {
    const [{ tradeType, minRent, maxRent }, setFilters] =
        useHousePropertyFilters();

    const [localRentRange, setLocalRentRange] = useState<[number, number]>([
        minRent ?? 0,
        maxRent ?? 4000,
    ]);

    const handleRentChange = (newValues: any) => {
        setLocalRentRange(newValues);
    };

    const onMinRentChange = (value: number) => {
        setLocalRentRange((prev) => [value, prev[1]]);
        setFilters((prev) => ({
            ...prev,
            minRent: value,
        }));
    };

    const onMaxRentChange = (value: number) => {
        setLocalRentRange((prev) => [prev[0], value]);
        setFilters((prev) => ({
            ...prev,
            maxRent: value,
        }));
    };

    const onMinMaxRentChange = (values: number[]) => {
        setFilters((prev) => ({
            ...prev,
            minRent: values[0],
            maxRent: values[1],
        }));
    };

    if (tradeType === tradeTypes.RENT) {
        return (
            <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Rent Range
                </label>
                <DualSlider
                    value={localRentRange}
                    minStepsBetweenThumbs={1}
                    max={4000}
                    min={0}
                    step={5}
                    onValueChange={handleRentChange}
                    onValueCommit={onMinMaxRentChange}
                    className={cn("w-full")}
                />
                <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center w-full gap-3">
                        <Input
                            aria-label="min"
                            className="h-8"
                            type="number"
                            placeholder="price"
                            value={localRentRange[0]}
                            onChange={(e) =>
                                setLocalRentRange((prev) => [
                                    Number(e.target.value),
                                    prev[1],
                                ])
                            }
                            onBlur={(e) =>
                                onMinRentChange(Number(e.target.value))
                            }
                        />
                        <Input
                            aria-label="min"
                            className="h-8"
                            type="number"
                            placeholder="price"
                            value={localRentRange[1]}
                            onChange={(e) =>
                                setLocalRentRange((prev) => [
                                    prev[0],
                                    Number(e.target.value),
                                ])
                            }
                            onBlur={(e) =>
                                onMaxRentChange(Number(e.target.value))
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
    return null;
};
