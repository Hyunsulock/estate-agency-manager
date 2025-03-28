"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUser } from "@/app/lib/useGetFunctions/useGetUser";
import { useUpdateUser } from "@/app/lib/useMutationFunctions/useUpdateUser";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; // ✅ 세션 훅

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const accountFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email."),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountForm() {
    const { data: session, status } = useSession();
    const userId = session?.id || null;

    const { data: user, isLoading } = useGetUser(userId || "");
    const { mutate: updateUser, isPending } = useUpdateUser();

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user, form]);

    const onSubmit = (data: AccountFormValues) => {
        if (!userId) return;
        updateUser(
            { id: userId, json: data },
            {
                onSuccess: () => {
                    toast.success("User updated successfully!");
                },
            }
        );
    };

    if (status === "loading" || isLoading)
        return <div>Loading user info...</div>;
    if (!userId) return <div>Not logged in</div>;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full max-w-md"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Updating..." : "Update User"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
