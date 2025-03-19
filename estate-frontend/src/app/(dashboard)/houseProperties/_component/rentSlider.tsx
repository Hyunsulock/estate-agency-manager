"use client";
import { useHousePropertyFilters } from "@/app/lib/useHousePropertyFilters";
import { tradeTypes } from "@/components/table/types";
import { DualSlider } from "@/components/ui/dualSlider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const RentSlider = () => {
    const [{ tradeType, minRent, maxRent }, setFilters] =
        useHousePropertyFilters();

    const onMinRentChange = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            minRent: value,
        }));
    };
    const onMaxRentChange = (value: number) => {
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
                    value={[minRent ?? 0, maxRent ?? 4000]}
                    minStepsBetweenThumbs={1}
                    max={4000}
                    min={0}
                    step={5}
                    onValueChange={onMinMaxRentChange}
                    className={cn("w-full")}
                />
                <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center w-full gap-3">
                        <Input
                            aria-label="min"
                            className="h-8"
                            type="number"
                            placeholder="price"
                            value={minRent ?? 0}
                            onChange={(e) =>
                                onMinRentChange(Number(e.target.value))
                            }
                        />
                        <Input
                            aria-label="min"
                            className="h-8"
                            type="number"
                            placeholder="price"
                            value={maxRent ?? 4000}
                            onChange={(e) =>
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
