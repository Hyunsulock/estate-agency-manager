'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status, update } = useSession();
    if (session?.user) {
        redirect("/");
    }
    return <div>{children}</div>;
}
