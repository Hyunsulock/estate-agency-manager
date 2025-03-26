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
import { useCreateCustomer } from "@/app/lib/useMutationFunctions/useCreateCustomer";
import { toast } from "sonner";

const createCustomerSchema = z.object({
    name: z.string().min(1, "Customer name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    intro: z.string().optional(),
});

export const CreateCustomerForm = ({ onCancel }: { onCancel: () => void }) => {
    const { mutate, isPending } = useCreateCustomer();
    const form = useForm<z.infer<typeof createCustomerSchema>>({
        resolver: zodResolver(createCustomerSchema),
    });

    const onSubmit = (values: z.infer<typeof createCustomerSchema>) => {
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
                    Create New Customer
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
                                            placeholder="Customer name"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Phone number"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="intro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Intro</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Intro or description"
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
