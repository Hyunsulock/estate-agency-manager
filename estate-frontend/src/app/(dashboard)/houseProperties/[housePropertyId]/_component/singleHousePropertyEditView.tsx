"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useGetSingleHouseProperty } from "@/app/lib/useGetFunctions/useGetSingleHouse";
import { useSocket } from "@/app/components/socketProvider";
import { useSession } from "next-auth/react";
import { HousePropertyStatus } from "@/components/table/types";
import { useUpdateHouseProperty } from "@/app/lib/useMutationFunctions/useUpdateHouseProperty";

const housePropertySchema = z.object({
    buildingNumber: z.string(),
    floor: z.string(),
    room: z.string(),
    size: z.string(),
    unitNumber: z.string().optional(),
    status: z.string(),
});

export const RealtimeEditForm = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetSingleHouseProperty(id);
    const form = useForm<z.infer<typeof housePropertySchema>>({
        resolver: zodResolver(housePropertySchema),
    });

    const socket = useSocket();
    const { data: user } = useSession();
    const [activeEditors, setActiveEditors] = useState<Record<string, any>>({});
    const { mutate: updateHouseProperty } = useUpdateHouseProperty();

    useEffect(() => {
        if (data) {
            form.reset({
                buildingNumber: String(data.buildingNumber ?? ""),
                floor: String(data.floor ?? ""),
                room: String(data.room ?? ""),
                size: String(data.size ?? ""),
                unitNumber: data.unitNumber ? String(data.unitNumber) : "",
                status: data.status ?? "",
            });
        }
    }, [data, form]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleSnapshot = (snapshot: any[]) => {
            const editorsForThisForm = snapshot.reduce((acc: any, editor) => {
                if (
                    editor.type === "houseProperty" &&
                    String(editor.id) === id
                ) {
                    acc[editor.field] = editor;
                }
                return acc;
            }, {});
            setActiveEditors(editorsForThisForm);
        };

        socket.emit("request_active_editors", {
            type: "houseProperty",
            id: Number(id),
        });

        socket.on("active_editors_snapshot", handleSnapshot);

        socket.on("editing", (editorInfo) => {
            if (
                editorInfo.type === "houseProperty" &&
                String(editorInfo.id) === id
            ) {
                setActiveEditors((prev) => ({
                    ...prev,
                    [editorInfo.field]: editorInfo,
                }));
            }
        });

        socket.on("done_editing", (editorInfo) => {
            if (
                editorInfo.type === "houseProperty" &&
                String(editorInfo.id) === id
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
    }, [socket, id, user]);

    const handleFocus = (field: string) => {
        socket?.emit("editing", {
            type: "houseProperty",
            id: Number(id),
            field,
            updatedBy: user?.id,
            name: user?.name,
            email: user?.email,
        });
    };

    const handleBlur = (field: string) => {
        socket?.emit("done_editing", {
            type: "houseProperty",
            id: Number(id),
            field,
        });

        const value =
            form.getValues()[
                field as keyof z.infer<typeof housePropertySchema>
            ];

        updateHouseProperty({
            id,
            json: { [field]: isNaN(Number(value)) ? value : Number(value) },
        });
    };

    const handleStatusChange = (val: string) => {
        form.setValue("status", val);
        // updateHouseProperty({
        //     id,
        //     json: { status: val },
        // });
    };

    const isLocked = (field: string) =>
        activeEditors[field] && activeEditors[field].updatedBy !== user?.id;

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="flex justify-center py-8">
            <Card className="w-full h-full shadow-lg">
                <CardHeader>
                    <CardTitle>House Property</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-1md:col-span-2">
                            <div className="font-bold">
                                {data?.apartment?.name}
                            </div>
                            <div>{data?.apartment?.address}</div>
                        </div>
                        {[
                            {
                                label: "Building Number",
                                field: "buildingNumber",
                            },
                            { label: "Floor", field: "floor" },
                            { label: "Room", field: "room" },
                            { label: "Size (㎡)", field: "size" },
                            {
                                label: "Unit Number (optional)",
                                field: "unitNumber",
                            },
                        ].map(({ label, field }) => (
                            <div key={field} className="grid gap-2">
                                <Label>{label}</Label>
                                <Input
                                    {...form.register(field as any)}
                                    placeholder={label}
                                    onFocus={() => handleFocus(field)}
                                    onBlur={() => handleBlur(field)}
                                    disabled={isLocked(field)}
                                    className={
                                        isLocked(field) ? "border-red-500" : ""
                                    }
                                />
                                {isLocked(field) && (
                                    <p className="text-xs text-red-500">
                                        Being edited by{" "}
                                        {activeEditors[field]?.name}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="grid gap-2 md:col-span-2">
                            <Label>Status</Label>
                            <Select
                                value={form.getValues().status}
                                onValueChange={handleStatusChange}
                                onOpenChange={(open) =>
                                    open
                                        ? handleFocus("status")
                                        : handleBlur("status")
                                }
                                disabled={isLocked("status")}
                            >
                                <SelectTrigger
                                    className={
                                        isLocked("status")
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(HousePropertyStatus).map(
                                        (status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status.toUpperCase()}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            {isLocked("status") && (
                                <p className="text-xs text-red-500">
                                    Being edited by{" "}
                                    {activeEditors["status"]?.name}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
