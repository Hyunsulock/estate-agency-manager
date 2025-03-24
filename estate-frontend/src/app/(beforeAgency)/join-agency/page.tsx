"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NoAgencyPage() {
    const router = useRouter();

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-4">
            {/* Top-right logout button */}
            <div className="absolute top-4 right-4">
                <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    Logout
                </Button>
            </div>

            <h1 className="text-2xl font-bold">
                You're not part of any agency yet!
            </h1>
            <p>Please choose what you’d like to do:</p>
            <div className="flex gap-4">
                <Button onClick={() => router.push("/create-agency")}>
                    Create Agency
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => router.push("/invitations")}
                >
                    Look for Invitations
                </Button>
            </div>
        </div>
    );
}
