"use client";
import { DualSlider } from "@/components/ui/dualSlider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface RangeSliderFilterProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    minValue?: number;
    maxValue?: number;
    onRangeCommit: (values: [number, number]) => void;
    tradeTypeValue: string;
}

export const RangeSliderFilter = ({
    label,
    min,
    max,
    step = 1,
    minValue,
    maxValue,
    onRangeCommit,
    tradeTypeValue,
}: RangeSliderFilterProps) => {
    if (tradeTypeValue !== "rent" && label === "Rent Range") {
        return null;
    }

    const [localRange, setLocalRange] = useState<[number, number]>([
        minValue ?? min,
        maxValue ?? max,
    ]);

    useEffect(() => {
        setLocalRange([minValue ?? min, maxValue ?? max]);
    }, [minValue, maxValue, min, max]);

    const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

    const onMinInputBlur = (value: number) => {
        const clamped = clamp(value, min, localRange[1]);
        setLocalRange((prev) => [clamped, prev[1]]);
        onRangeCommit([clamped, localRange[1]]);
    };

    const onMaxInputBlur = (value: number) => {
        const clamped = clamp(value, localRange[0], max);
        setLocalRange((prev) => [prev[0], clamped]);
        onRangeCommit([localRange[0], clamped]);
    };

    return (
        <div className="grid gap-4 p-4 mb-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <DualSlider
                value={localRange}
                onValueChange={(values) =>
                    setLocalRange(values as [number, number])
                }
                onValueCommit={(values) =>
                    onRangeCommit(values as [number, number])
                }
                minStepsBetweenThumbs={1}
                min={min}
                max={max}
                step={step}
                className={cn("w-full")}
            />
            <div className="flex gap-2 flex-wrap">
                <div className="flex items-center w-full gap-3">
                    <Input
                        type="number"
                        value={localRange[0]}
                        onChange={(e) =>
                            setLocalRange((prev) => [
                                Number(e.target.value),
                                prev[1],
                            ])
                        }
                        onBlur={(e) => onMinInputBlur(Number(e.target.value))}
                        className="h-8"
                        placeholder="Min"
                    />
                    <Input
                        type="number"
                        value={localRange[1]}
                        onChange={(e) =>
                            setLocalRange((prev) => [
                                prev[0],
                                Number(e.target.value),
                            ])
                        }
                        onBlur={(e) => onMaxInputBlur(Number(e.target.value))}
                        className="h-8"
                        placeholder="Max"
                    />
                </div>
            </div>
        </div>
    );
};
