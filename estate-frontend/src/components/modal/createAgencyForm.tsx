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
import { useCreateAgency } from "@/app/lib/useMutationFunctions/useCreateAgency";
import { toast } from "sonner";

const createAgencySchema = z.object({
    name: z.string().min(1, "Agency name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
});

export const CreateAgencyForm = ({ onCancel }: { onCancel: () => void }) => {
    const { mutate, isPending } = useCreateAgency();
    const form = useForm<z.infer<typeof createAgencySchema>>({
        resolver: zodResolver(createAgencySchema),
    });

    const onSubmit = (values: z.infer<typeof createAgencySchema>) => {
        mutate(
            { form: values },
            {
                onSuccess: () => {
                    // toast.success("Agency created successfully");
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
                    Create New Agency
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
                                            placeholder="Agency name"
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
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Location"
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
