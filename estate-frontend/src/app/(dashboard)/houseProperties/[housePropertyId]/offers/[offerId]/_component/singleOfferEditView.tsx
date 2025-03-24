"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useSocket } from "@/app/components/socketProvider";
import { useSession } from "next-auth/react";
import { useGetSingleOffer } from "@/app/lib/useGetFunctions/useGetSingleOffer";
import { useUpdateOffer } from "@/app/lib/useMutationFunctions/useUpdateOffer";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { Button } from "@/components/ui/button";
import { NetworkIcon } from "lucide-react";

const tradeTypeOptions = ["sale", "jeonse", "rent"] as const;
const statusOptions = ["active", "onhold", "done"] as const;

const offerSchema = z.object({
    tradeType: z.string(),
    salePrice: z.number().optional(),
    rentDeposit: z.number().optional(),
    rentPrice: z.number().optional(),
    jeonseDeposit: z.number().optional(),
    status: z.string(),
    keyFeatures: z.string().optional(),
    agencyId: z.number(),
});

interface RealtimeOfferEditFormProps {
    housePropertyId: string;
    offerId: string;
}

export const RealtimeOfferEditForm = ({
    housePropertyId,
    offerId,
}: RealtimeOfferEditFormProps) => {
    const { data: offerData, isLoading: isOfferLoading } = useGetSingleOffer(
        housePropertyId,
        offerId
    );
    const { data: user } = useSession();
    const socket = useSocket();
    const { data: agencies, isLoading: isAgencyLoading } = useGetAgencies();
    const { mutate: updateOffer } = useUpdateOffer();

    const form = useForm<z.infer<typeof offerSchema>>({
        resolver: zodResolver(offerSchema),
    });

    const [activeEditors, setActiveEditors] = useState<Record<string, any>>({});

    useEffect(() => {
        if (offerData) {
            form.reset({
                tradeType: offerData.tradeType,
                salePrice: offerData.salePrice ?? undefined,
                rentDeposit: offerData.rentDeposit ?? undefined,
                rentPrice: offerData.rentPrice ?? undefined,
                jeonseDeposit: offerData.jeonseDeposit ?? undefined,
                status: offerData.status,
                keyFeatures: offerData.keyFeatures ?? "",
                agencyId: offerData.agency?.id,
            });
        }
    }, [offerData, form]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleSnapshot = (snapshot: any[]) => {
            const editorsForThisOffer = snapshot.reduce((acc: any, editor) => {
                if (editor.type === "offer" && String(editor.id) === offerId) {
                    acc[editor.field] = editor;
                }
                return acc;
            }, {});
            setActiveEditors(editorsForThisOffer);
        };

        socket.emit("request_active_editors", {
            type: "offer",
            id: Number(offerId),
        });

        socket.on("active_editors_snapshot", handleSnapshot);
        socket.on("editing", (editorInfo) => {
            if (
                editorInfo.type === "offer" &&
                String(editorInfo.id) === offerId
            ) {
                setActiveEditors((prev) => ({
                    ...prev,
                    [editorInfo.field]: editorInfo,
                }));
            }
        });

        socket.on("done_editing", (editorInfo) => {
            if (
                editorInfo.type === "offer" &&
                String(editorInfo.id) === offerId
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
    }, [socket, offerId, user]);

    const handleFocus = (field: string) => {
        socket?.emit("editing", {
            type: "offer",
            id: Number(offerId),
            field,
            updatedBy: user?.id,
            name: user?.name,
            email: user?.email,
        });
    };

    const handleBlur = (field: string) => {
        socket?.emit("done_editing", {
            type: "offer",
            id: Number(offerId),
            field,
        });

        const value =
            form.getValues()[field as keyof z.infer<typeof offerSchema>];
        updateOffer({
            id: offerId,
            json: {
                [field]:
                    typeof value === "string" && value.trim() === ""
                        ? null
                        : value,
            },
        });
    };

    const isLocked = (field: string) =>
        activeEditors[field] && activeEditors[field].updatedBy !== user?.id;
    const tradeType = form.watch("tradeType");

    if (isAgencyLoading || isOfferLoading)
        return <div className="p-4">Loading offer...</div>;

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <CardTitle>Offer Realtime Edit</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label>Trade Type</Label>
                        <Select
                            value={form.getValues().tradeType}
                            onValueChange={(val) =>
                                form.setValue("tradeType", val)
                            }
                            onOpenChange={(open) =>
                                open
                                    ? handleFocus("tradeType")
                                    : handleBlur("tradeType")
                            }
                            disabled={isLocked("tradeType")}
                        >
                            <SelectTrigger
                                className={
                                    isLocked("tradeType")
                                        ? "border-red-500"
                                        : ""
                                }
                            >
                                <SelectValue placeholder="Select trade type" />
                            </SelectTrigger>
                            <SelectContent>
                                {tradeTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isLocked("tradeType") && (
                            <p className="text-xs text-red-500">
                                Being edited by{" "}
                                {activeEditors["tradeType"]?.name}
                            </p>
                        )}
                    </div>

                    {tradeType === "sale" && (
                        <>
                            <Input
                                {...form.register("salePrice")}
                                type="number"
                                placeholder="Sale Price"
                                onFocus={() => handleFocus("salePrice")}
                                onBlur={() => handleBlur("salePrice")}
                                disabled={isLocked("salePrice")}
                            />
                            {isLocked("salePrice") && (
                                <p className="text-xs text-red-500">
                                    Being edited by{" "}
                                    {activeEditors["salePrice"]?.name}
                                </p>
                            )}
                        </>
                    )}

                    {tradeType === "rent" && (
                        <>
                            <Input
                                {...form.register("rentDeposit")}
                                type="number"
                                placeholder="Rent Deposit"
                                onFocus={() => handleFocus("rentDeposit")}
                                onBlur={() => handleBlur("rentDeposit")}
                                disabled={isLocked("rentDeposit")}
                            />
                            {isLocked("rentDeposit") && (
                                <p className="text-xs text-red-500">
                                    Being edited by{" "}
                                    {activeEditors["rentDeposit"]?.name}
                                </p>
                            )}
                            <Input
                                {...form.register("rentPrice")}
                                type="number"
                                placeholder="Rent Price"
                                onFocus={() => handleFocus("rentPrice")}
                                onBlur={() => handleBlur("rentPrice")}
                                disabled={isLocked("rentPrice")}
                            />
                            {isLocked("rentPrice") && (
                                <p className="text-xs text-red-500">
                                    Being edited by{" "}
                                    {activeEditors["rentPrice"]?.name}
                                </p>
                            )}
                        </>
                    )}

                    {tradeType === "jeonse" && (
                        <>
                            <Input
                                {...form.register("jeonseDeposit")}
                                type="number"
                                placeholder="Jeonse Deposit"
                                onFocus={() => handleFocus("jeonseDeposit")}
                                onBlur={() => handleBlur("jeonseDeposit")}
                                disabled={isLocked("jeonseDeposit")}
                            />
                            {isLocked("salePrice") && (
                                <p className="text-xs text-red-500">
                                    Being edited by{" "}
                                    {activeEditors["salePrice"]?.name}
                                </p>
                            )}
                        </>
                    )}

                    <Input
                        {...form.register("keyFeatures")}
                        type="text"
                        placeholder="Key Features"
                        onFocus={() => handleFocus("keyFeatures")}
                        onBlur={() => handleBlur("keyFeatures")}
                        disabled={isLocked("keyFeatures")}
                    />

                    <Label>Status</Label>
                    <Select
                        value={form.getValues().status}
                        onValueChange={(val) => form.setValue("status", val)}
                        onOpenChange={(open) =>
                            open ? handleFocus("status") : handleBlur("status")
                        }
                        disabled={isLocked("status")}
                    >
                        <SelectTrigger
                            className={
                                isLocked("status") ? "border-red-500" : ""
                            }
                        >
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isLocked("status") && (
                        <p className="text-xs text-red-500">
                            Being edited by {activeEditors["status"]?.name}
                        </p>
                    )}

                    <Label>Agency</Label>
                    <Select
                        value={
                            form.watch("agencyId")
                                ? String(form.watch("agencyId"))
                                : ""
                        }
                        //defaultValue={offerData.agency?.id}
                        onValueChange={(val) =>
                            form.setValue("agencyId", Number(val))
                        }
                        onOpenChange={(open) =>
                            open
                                ? handleFocus("agencyId")
                                : handleBlur("agencyId")
                        }
                        disabled={isLocked("agencyId")}
                    >
                        <SelectTrigger
                            className={
                                isLocked("agencyId") ? "border-red-500" : ""
                            }
                        >
                            <div className="flex items-center pr-2">
                                <NetworkIcon className="size-4 mr-2" />
                                <SelectValue placeholder="Select agency" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {agencies?.map((agency: any) => (
                                <SelectItem
                                    key={agency.id}
                                    value={String(agency.id)}
                                >
                                    {agency.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isLocked("agencyId") && (
                        <p className="text-xs text-red-500">
                            Being edited by {activeEditors["agencyId"]?.name}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
