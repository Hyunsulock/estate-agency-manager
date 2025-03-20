"use client";
import { useCreateHousePropertyWithOffer } from "@/app/lib/useMutationFunctions/useCreateHousePropertyWithOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectSeparator,
} from "@/components/ui/select";
import { Building2Icon } from "lucide-react";
import { useGetApartments } from "@/app/lib/useGetFunctions/useGetApartments";
import { OfferFormSection } from "@/app/(dashboard)/houseProperties/_component/offerForm";

interface CreateHousePropertyFormProps {
    onCancel?: () => void;
}

const tradeTypeOptions = ["sale", "jeonse", "rent"] as const;
const statusOptions = ["active", "onhold", "done"] as const;

const offerSchema = z.object({
    tradeType: z.enum(tradeTypeOptions, {
        errorMap: () => ({ message: "Select trade type" }),
    }),
    salePrice: z.preprocess((val) => Number(val), z.number().optional()),
    rentDeposit: z.number().optional(),
    rentPrice: z.number().optional(),
    jeonseDeposit: z.number().optional(),
    status: z.enum(statusOptions, {
        errorMap: () => ({ message: "Select status" }),
    }),
    keyFeatures: z.string().optional(),
    agencyId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, "Enter number of rooms")
    ),
});

const createHousePropertySchema = z.object({
    apartmentId: z.preprocess(
        (val) => Number(val),
        z
            .number({
                invalid_type_error: "Please select a property type",
            })
            .min(1, "Input apartment")
    ),
    room: z.preprocess(
        (val) => Number(val),
        z.number().min(1, "Enter number of rooms")
    ),
    size: z.preprocess((val) => Number(val), z.number().min(1, "Enter size")),
    buildingNumber: z.preprocess(
        (val) => Number(val),
        z.number().min(1, "Enter building number")
    ),
    floor: z.preprocess((val) => Number(val), z.number().min(1, "Enter floor")),
    unitNumber: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number().optional()
    ),
});

export const createHousePropertyWithOfferSchema = z.object({
    houseProperty: createHousePropertySchema,
    offer: offerSchema,
});

export const CreateHousePropertyForm = ({
    onCancel,
}: CreateHousePropertyFormProps) => {
    //const router = useRouter();
    const { data: apartments, isLoading: isLoadingApartments } =
        useGetApartments();

    const apartmentOptions = apartments?.map((apartment: any) => ({
        value: String(apartment.id),
        label: apartment.name,
    }));

    const { mutate, isPending } = useCreateHousePropertyWithOffer();

    //const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createHousePropertyWithOfferSchema>>({
        resolver: zodResolver(createHousePropertyWithOfferSchema),
    });

    const onSubmit = (
        values: z.infer<typeof createHousePropertyWithOfferSchema>
    ) => {
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

    if (isLoadingApartments) {
        return null;
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex pt-4 ">
                <CardTitle className="text-xl font-bold">
                    Create New Property Listing
                </CardTitle>
            </CardHeader>
            <CardContent className="pv-3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2">
                            <div className="flex flex-col gap-y-2 flex-1">
                                <div className="text-lg font-bold">
                                    Property Details
                                </div>

                                <FormField
                                    control={form.control}
                                    name="houseProperty.apartmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apartment</FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        Number(value)
                                                    )
                                                }
                                                defaultValue={
                                                    field.value
                                                        ? String(field.value)
                                                        : undefined
                                                }
                                            >
                                                <SelectTrigger className="w-full h-12">
                                                    <div className="flex items-center pr-2">
                                                        <Building2Icon className="size-4 mr-2" />
                                                        <SelectValue placeholder="Select apartment" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {apartmentOptions?.map(
                                                        (apartment: any) => (
                                                            <SelectItem
                                                                key={
                                                                    apartment.value
                                                                }
                                                                value={
                                                                    apartment.value
                                                                }
                                                            >
                                                                {
                                                                    apartment.label
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="houseProperty.buildingNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Building Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter building number"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                                <FormField
                                    control={form.control}
                                    name="houseProperty.floor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Floor</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter Floor"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                                <FormField
                                    control={form.control}
                                    name="houseProperty.room"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Room</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter number of rooms"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                                <FormField
                                    control={form.control}
                                    name="houseProperty.size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter size"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                                <FormField
                                    control={form.control}
                                    name="houseProperty.unitNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter unit number"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                            </div>
                            <div className="flex flex-col gap-y-2 flex-1">
                                <div className="text-lg font-bold">
                                    Offer Details
                                </div>
                                <OfferFormSection />
                            </div>
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
                                Create House Property
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
