"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useCreateAgency } from "@/app/lib/useMutationFunctions/useCreateAgency";
import { useConfirm } from "@/hooks/use-confirm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAgencyAdmin } from "@/app/lib/useMutationFunctions/useCreateAgencyAdmin";

const createAgencySchema = z.object({
    name: z.string().min(1, "Agency name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
});

export default function CreateAgencyForm() {
    const form = useForm<z.infer<typeof createAgencySchema>>({
        resolver: zodResolver(createAgencySchema),
    });

    const { mutate, isPending } = useCreateAgencyAdmin();
    const { confirm, ConfirmDialog } = useConfirm(
        "Create Agency",
        "Are you sure you want to create this agency? This you wiil have to login again."
    );

    const onSubmit = async (values: z.infer<typeof createAgencySchema>) => {
        const ok = await confirm(); // ✅ 사용자 확인
        if (!ok) return;

        mutate(
            { form: values },
            {
                onSuccess: () => {
                    toast.success("Agency created successfully");
                    signOut(); // ✅ 생성 후 로그아웃
                },
                onError: () => {
                    toast.error("Failed to create agency");
                },
            }
        );
    };

    return (
        <>
            <ConfirmDialog /> {/* ✅ confirm 다이얼로그 렌더링 */}
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
                                        <FormMessage />
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
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isPending}>
                                    Create Agency
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
