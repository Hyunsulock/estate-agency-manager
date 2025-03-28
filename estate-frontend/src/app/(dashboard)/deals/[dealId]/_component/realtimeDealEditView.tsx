"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useSocket } from "@/app/components/socketProvider";
import { useSession } from "next-auth/react";
import { useGetSingleDeal } from "@/app/lib/useGetFunctions/useGetSingleDeal";
import { useUpdateDeal } from "@/app/lib/useMutationFunctions/useUpdateDeal";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { useGetCustomersQuery } from "@/app/lib/useGetFunctions/useGetCustomersQuery";
import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";

const dealSchema = z.object({
    dealDate: z.date(),
    buyAgencyId: z.number(),
    sellAgencyId: z.number(),
    buyerId: z.number().optional(),
    sellerId: z.number().optional(),
    dealerId: z.number(),
});

export const RealtimeDealEditView = ({
    dealId,
}: // agencies,
// customers,
// users,
{
    dealId: string;
    // agencies: any[];
    // customers: any[];
    // users: any[];
}) => {
    const { data: deal, isLoading } = useGetSingleDeal(dealId);
    const { data: agencies, isLoading: isLoadingAgency } = useGetAgencies();
    const { data: customers, isLoading: isLoadingCustomer } =
        useGetCustomersQuery({
            name: null,
            phoneNumber: null,
            intro: null,
        });
    const { data: users, isLoading: isLoadingUsers } = useGetUsers();
    const form = useForm<z.infer<typeof dealSchema>>({
        resolver: zodResolver(dealSchema),
    });

    const socket = useSocket();
    const { data: user } = useSession();
    const [activeEditors, setActiveEditors] = useState<Record<string, any>>({});
    const { mutate: updateDeal } = useUpdateDeal();

    useEffect(() => {
        if (deal) {
            form.reset({
                dealDate: new Date(deal.dealDate),
                buyAgencyId: deal.buyAgency.id,
                sellAgencyId: deal.sellAgency.id,
                buyerId: deal.buyer.id,
                sellerId: deal.seller.id,
                dealerId: deal.dealer.id,
            });
        }
    }, [deal, form]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleSnapshot = (snapshot: any[]) => {
            const editorsForThisForm = snapshot.reduce((acc: any, editor) => {
                if (
                    editor.type === "deal" &&
                    String(editor.id) === String(dealId)
                ) {
                    acc[editor.field] = editor;
                }
                return acc;
            }, {});
            setActiveEditors(editorsForThisForm);
        };

        socket.emit("request_active_editors", { type: "deal", id: dealId });
        socket.on("active_editors_snapshot", handleSnapshot);

        socket.on("editing", (editorInfo) => {
            if (
                editorInfo.type === "deal" &&
                String(editorInfo.id) === String(dealId)
            ) {
                setActiveEditors((prev) => ({
                    ...prev,
                    [editorInfo.field]: editorInfo,
                }));
            }
        });

        socket.on("done_editing", (editorInfo) => {
            if (
                editorInfo.type === "deal" &&
                String(editorInfo.id) === String(dealId)
            ) {
                setActiveEditors((prev) => {
                    const copy = { ...prev };
                    delete copy[editorInfo.field];
                    return copy;
                });
            }
        });

        return () => {
            socket.off("active_editors_snapshot", handleSnapshot);
            socket.off("editing");
            socket.off("done_editing");
        };
    }, [socket, dealId, user]);

    const handleFocus = (field: string) => {
        socket?.emit("editing", {
            type: "deal",
            id: dealId,
            field,
            updatedBy: user?.id,
            name: user?.name,
            email: user?.email,
        });
    };

    const handleBlur = (field: string) => {
        socket?.emit("done_editing", { type: "deal", id: dealId, field });
        const value =
            form.getValues()[field as keyof z.infer<typeof dealSchema>];
        updateDeal({
            id: dealId,
            json: { [field]: value },
        });
    };

    const isLocked = (field: string) =>
        activeEditors[field] && activeEditors[field].updatedBy !== user?.id;

    if (isLoading || isLoadingAgency || isLoadingCustomer || isLoadingUsers) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <Card className="w-full shadow-lg p-4">
            <CardHeader>
                <CardTitle>Deal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {/* Deal Date */}
                    <div className="grid gap-2">
                        <Label>Deal Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full text-left font-normal",
                                        !form.getValues().dealDate &&
                                            "text-muted-foreground"
                                    )}
                                    onFocus={() => handleFocus("dealDate")}
                                    onBlur={() => handleBlur("dealDate")}
                                >
                                    {form.getValues().dealDate ? (
                                        format(
                                            form.getValues().dealDate as Date,
                                            "PPP"
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={form.getValues().dealDate}
                                    onSelect={(date) => {
                                        form.setValue("dealDate", date!);
                                        handleBlur("dealDate");
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Dynamic select fields */}
                    {["buyAgencyId", "sellAgencyId", "buyerId", "sellerId"].map(
                        (field) => (
                            <div key={field} className="grid gap-2">
                                <Label>
                                    {field.replace("Id", "")}{" "}
                                    {deal[field.replace("Id", "")].phoneNumber}
                                </Label>
                                <Select
                                    value={String(
                                        form.getValues()[
                                            field as keyof z.infer<
                                                typeof dealSchema
                                            >
                                        ] ?? ""
                                    )}
                                    onValueChange={(val) => {
                                        form.setValue(
                                            field as any,
                                            Number(val)
                                        );
                                        // handleBlur(field);
                                    }}
                                    onOpenChange={(open) =>
                                        open
                                            ? handleFocus(field)
                                            : handleBlur(field)
                                    }
                                    disabled={isLocked(field)}
                                >
                                    <SelectTrigger
                                        className={
                                            isLocked(field)
                                                ? "border-red-500"
                                                : ""
                                        }
                                    >
                                        <SelectValue
                                            placeholder={`Select ${field}`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(field.includes("Agency")
                                            ? agencies
                                            : field.includes("buyer") ||
                                              field.includes("seller")
                                            ? customers
                                            : users
                                        ).map((item: any) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isLocked(field) && (
                                    <p className="text-xs text-red-500">
                                        Being edited by{" "}
                                        {activeEditors[field]?.name}
                                    </p>
                                )}
                            </div>
                        )
                    )}
                    {["dealerId"].map((field) => (
                        <div key={field} className="grid gap-2">
                            <Label>{field.replace("Id", "")}</Label>
                            <Select
                                value={String(
                                    form.getValues()[
                                        field as keyof z.infer<
                                            typeof dealSchema
                                        >
                                    ] ?? ""
                                )}
                                onValueChange={(val) => {
                                    form.setValue(field as any, Number(val));
                                    // handleBlur(field);
                                }}
                                onOpenChange={(open) =>
                                    open
                                        ? handleFocus(field)
                                        : handleBlur(field)
                                }
                                disabled={isLocked(field)}
                            >
                                <SelectTrigger
                                    className={
                                        isLocked(field) ? "border-red-500" : ""
                                    }
                                >
                                    <SelectValue
                                        placeholder={`Select ${field}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {(field.includes("Agency")
                                        ? agencies
                                        : field.includes("buyer") ||
                                          field.includes("seller")
                                        ? customers
                                        : users
                                    ).map((item: any) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isLocked(field) && (
                                <p className="text-xs text-red-500">
                                    Being edited by {activeEditors[field]?.name}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
