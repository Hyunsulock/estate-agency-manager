"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Backend_URL } from "@/app/lib/Constants";
import { useSession } from "next-auth/react";
import { useGetInvitations } from "@/app/lib/useGetFunctions/useGetInvitations";

export default function WaitInvitationPage() {
    const { data: invitations, isLoading } = useGetInvitations();
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const acceptInvitation = async (invitationId: number) => {
        const res = await fetch(
            Backend_URL + `/notifications/invite/${invitationId}/accept`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                    body: JSON.stringify({ accepted: true }),
                },
            }
        );
        if (!res.ok) throw new Error("Failed to accept invitation");
        return res.json();
    };
    const router = useRouter();

    const { mutate: acceptInvite } = useMutation({
        mutationFn: acceptInvitation,
        onSuccess: () => {
            toast.success("Invitation accepted!");
            signOut({ callbackUrl: "/" });
        },
        onError: () => toast.error("Failed to accept invitation"),
    });

    if (isLoading) return <p>Loading invitations...</p>;

    return (
        <div className="flex flex-col items-center p-8 gap-4">
            <h1 className="text-2xl font-bold mb-4">Your Invitations</h1>
            {invitations.length === 0 ? (
                <p>No invitations yet. Please wait for an invitation!</p>
            ) : (
                <ul className="w-full max-w-md space-y-4">
                    {invitations.map((invitation: any) => (
                        <li
                            key={invitation.id}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">
                                    {invitation.agency?.name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {invitation.message}
                                </p>
                            </div>
                            <Button
                                onClick={() => acceptInvite(invitation.id)}
                                disabled={invitation.accepted}
                            >
                                {invitation.accepted ? "Accepted" : "Accept"}
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
