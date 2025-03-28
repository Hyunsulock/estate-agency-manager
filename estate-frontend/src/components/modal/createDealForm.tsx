"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useCreateDeal } from "@/app/lib/useMutationFunctions/useCreateDeal";
import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { useGetCustomersQuery } from "@/app/lib/useGetFunctions/useGetCustomersQuery";
import { useEffect } from "react";

const createDealSchema = z.object({
    housePropertyId: z.number(),
    offerId: z.number().optional(),
    buyAgencyId: z.number().min(1, "Select buy agency"),
    sellAgencyId: z.number().min(1, "Select sell agency"),
    buyerId: z.number().optional(),
    sellerId: z.number().optional(),
    dealerId: z.number().min(1, "Select dealer"),
    dealDate: z.date({ required_error: "Please select a deal date." }),
});

interface CreateDealFormProps {
    onCancel: () => void;
    housePropertyId: number;
    offerId?: number;
    agencies: any;
    customers: any;
}

export const CreateDealForm = ({
    onCancel,
    housePropertyId,
    offerId,
    agencies,
    customers
}: CreateDealFormProps) => {
    const { data: users, isLoading: userLoading } = useGetUsers();

    const { mutate, isPending } = useCreateDeal();
    const form = useForm<z.infer<typeof createDealSchema>>({
        resolver: zodResolver(createDealSchema),
        defaultValues: {
            housePropertyId,
            offerId: offerId ?? undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof createDealSchema>) => {
        mutate(
            { form: values },
            {
                onSuccess: () => {
                    form.reset();
                    onCancel();
                },
            }
        );
    };

    return (
        <Card className="w-full border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Create New Deal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="dealDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Deal Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />

                        {"buyAgencyId,sellAgencyId".split(",").map((name) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={
                                    name as keyof z.infer<
                                        typeof createDealSchema
                                    >
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {name.replace("Id", "")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={(val) =>
                                                field.onChange(Number(val))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={`Select ${name}`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(agencies ?? []).map(
                                                    (agency: any) => (
                                                        <SelectItem
                                                            key={agency.id}
                                                            value={String(
                                                                agency.id
                                                            )}
                                                        >
                                                            {agency.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        ))}

                        {"buyerId,sellerId".split(",").map((name) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={
                                    name as keyof z.infer<
                                        typeof createDealSchema
                                    >
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {name
                                                .replace("Id", "")
                                                .replace(/([A-Z])/g, " $1")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={(val) =>
                                                field.onChange(Number(val))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={`Select ${name} (optional)`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(customers ?? []).map(
                                                    (customer: any) => (
                                                        <SelectItem
                                                            key={customer.id}
                                                            value={String(
                                                                customer.id
                                                            )}
                                                        >
                                                            {customer.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        ))}

                        <FormField
                            control={form.control}
                            name="dealerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dealer</FormLabel>
                                    <Select
                                        onValueChange={(val) =>
                                            field.onChange(Number(val))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select dealer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(users ?? []).map((user: any) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={String(user.id)}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={onCancel}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Create Deal
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
};
