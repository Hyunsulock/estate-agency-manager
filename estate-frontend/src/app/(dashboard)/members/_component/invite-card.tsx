"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Backend_URL } from "@/app/lib/Constants";
import { useSession } from "next-auth/react";

export const InviteUserCard = () => {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { data: session } = useSession();

    const handleInvite = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }
        setIsSending(true);

        try {
            const response = await fetch(
                Backend_URL + "/notifications/inviteByEmail",
                {
                    method: "POST",
                    body: JSON.stringify({ email }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send invitation");
            }
            toast.success(`Invitation sent to ${email}`);
            setEmail("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send invitation");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Invite a New Member</CardTitle>
                <CardDescription>
                    Search by email and invite them to your agency.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleInvite} disabled={isSending}>
                    {isSending ? "Sending..." : "Send Invitation"}
                </Button>
            </CardContent>
        </Card>
    );
};
