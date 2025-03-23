"use client";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { NetworkIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const OfferFormSection = () => {
    const form = useFormContext();
    const tradeType = form.watch("offer.tradeType");
    const { data: agencies, isLoading: isLoadingAgencies } = useGetAgencies();

    const agencyOptions = agencies?.map((agency: any) => ({
        value: String(agency.id),
        label: agency.name,
    }));

    const tradeTypes = [
        { value: "sale", label: "Sale" },
        { value: "jeonse", label: "Jeonse" },
        { value: "rent", label: "Rent" },
    ];

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "onhold", label: "On Hold" },
        { value: "done", label: "Done" },
    ];

    return (
        <div className="flex flex-col gap-y-2">
            <FormField
                control={form.control}
                name="offer.tradeType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Trade Type</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select trade type" />
                            </SelectTrigger>
                            <SelectContent>
                                {tradeTypes.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            {tradeType === "sale" && (
                <FormField
                    control={form.control}
                    name="offer.salePrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sale Price</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Enter sale price"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            )}

            {tradeType === "rent" && (
                <>
                    <FormField
                        control={form.control}
                        name="offer.rentDeposit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rent Deposit</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter rent deposit"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="offer.rentPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rent Price</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter rent price"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </>
            )}

            {tradeType === "jeonse" && (
                <FormField
                    control={form.control}
                    name="offer.jeonseDeposit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jeonse Deposit</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Enter jeonse deposit"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={form.control}
                name="offer.status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="offer.keyFeatures"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Key Features</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                placeholder="Enter key features or notes"
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {/* <FormField
                control={form.control}
                name="offer.agencyId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agency</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Enter agencyId"
                                value={field.value ?? ""}
                            />
                        </FormControl>
                    </FormItem>
                )}
            /> */}

            <FormField
                control={form.control}
                name="offer.agencyId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agency</FormLabel>
                        <Select
                            onValueChange={(value) =>
                                field.onChange(Number(value))
                            }
                            defaultValue={
                                field.value ? String(field.value) : undefined
                            }
                        >
                            <SelectTrigger className="w-full h-12">
                                <div className="flex items-center pr-2">
                                    <NetworkIcon className="size-4 mr-2" />
                                    <SelectValue placeholder="Select agency" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {agencyOptions?.map((agency: any) => (
                                    <SelectItem
                                        key={agency.value}
                                        value={agency.value}
                                    >
                                        {agency.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </div>
    );
};
