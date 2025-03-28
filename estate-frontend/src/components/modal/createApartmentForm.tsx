"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { useCreateApartment } from "@/app/lib/useMutationFunctions/useCreateApartment";
import { toast } from "sonner";

const createApartmentSchema = z.object({
    name: z.string().min(1, "Apartment name is required"),
    address: z.string().min(1, "Address is required"),
    buildingYear: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),
    parking: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z.number().optional()
    ),
});

export const CreateApartmentForm = ({ onCancel }: { onCancel: () => void }) => {
    const { mutate, isPending } = useCreateApartment();

    const form = useForm<z.infer<typeof createApartmentSchema>>({
        resolver: zodResolver(createApartmentSchema),
    });

    const onSubmit = (values: z.infer<typeof createApartmentSchema>) => {
        mutate(
            { form: values },
            {
                onSuccess: () => {
                    toast.success("Apartment created successfully");
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
                    Create New Apartment
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Apartment name"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="buildingYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Building Year (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. 2008"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parking"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parking (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. 1 spot per unit"
                                            {...field}
                                        />
                                    </FormControl>
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
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
