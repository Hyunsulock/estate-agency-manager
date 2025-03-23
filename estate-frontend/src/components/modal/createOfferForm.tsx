"use client";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfferFormSection } from "@/app/(dashboard)/houseProperties/_component/offerForm";
import { useCreateOffer } from "@/app/lib/useMutationFunctions/useCreateOffer"; // You can adjust the path
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { Input } from "../ui/input";
import { NetworkIcon } from "lucide-react";
const tradeTypeOptions = ["sale", "jeonse", "rent"] as const;
const statusOptions = ["active", "onhold", "done"] as const;

const offerSchema = z.object({
    tradeType: z.enum(tradeTypeOptions, {
        errorMap: () => ({ message: "Select trade type" }),
    }),
    rentDeposit: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),
    rentPrice: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),
    jeonseDeposit: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),
    salePrice: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),

    status: z.enum(statusOptions, {
        errorMap: () => ({ message: "Select status" }),
    }),
    keyFeatures: z.string().optional(),
    agencyId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, "Select agency")
    ),
    housePropertyId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, "Select agency")
    ),
});

interface OfferFormProps {
    onCancel?: () => void;
    housePropertyId: number;
}

export const CreateOfferForm = ({
    onCancel,
    housePropertyId,
}: OfferFormProps) => {
    const { mutate, isPending } = useCreateOffer();

    const form = useForm<z.infer<typeof offerSchema>>({
        resolver: zodResolver(offerSchema),
        defaultValues: {
            tradeType: undefined,
            salePrice: undefined,
            rentDeposit: undefined,
            rentPrice: undefined,
            jeonseDeposit: undefined,
            status: undefined,
            keyFeatures: undefined,
            agencyId: undefined,
            housePropertyId: housePropertyId,
        },
    });

    const onSubmit = (values: z.infer<typeof offerSchema>) => {
        console.log("hi", values);
        const finalValues = {
            ...values,
        };

        mutate(
            { form: finalValues },
            {
                onSuccess: ({ data }) => {
                    form.reset();
                    onCancel?.();
                },
            }
        );
    };

    const tradeType = form.watch("tradeType");
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

    if (isLoadingAgencies) {
        return null;
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex pt-4 ">
                <CardTitle className="text-xl font-bold">
                    Create New Offer
                </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {Object.keys(form.formState.errors).length > 0 && (
                            <pre className="text-red-500">
                                {JSON.stringify(form.formState.errors, null, 2)}
                            </pre>
                        )}

                        <div className="flex flex-col gap-y-2">
                            <FormField
                                control={form.control}
                                name="tradeType"
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
                                    name="salePrice"
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
                                        name="rentDeposit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Rent Deposit
                                                </FormLabel>
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
                                        name="rentPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Rent Price
                                                </FormLabel>
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
                                    name="jeonseDeposit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jeonse Deposit
                                            </FormLabel>
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
                                name="status"
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
                                name="keyFeatures"
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

                            <FormField
                                control={form.control}
                                name="agencyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agency</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            defaultValue={
                                                field.value
                                                    ? String(field.value)
                                                    : undefined
                                            }
                                        >
                                            <SelectTrigger className="w-full h-12">
                                                <div className="flex items-center pr-2">
                                                    <NetworkIcon className="size-4 mr-2" />
                                                    <SelectValue placeholder="Select agency" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agencyOptions?.map(
                                                    (agency: any) => (
                                                        <SelectItem
                                                            key={agency.value}
                                                            value={agency.value}
                                                        >
                                                            {agency.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={onCancel}
                                type="button"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                type="submit"
                                disabled={isPending}
                            >
                                Create Offer
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
