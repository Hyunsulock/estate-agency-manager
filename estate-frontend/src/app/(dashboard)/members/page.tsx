"use client";

import { useState } from "react";

import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";
import { MembersCard } from "./_component/members-card";
import { InviteUserCard } from "./_component/invite-card";

export default function MembersPage() {
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <MembersCard />
            <InviteUserCard />
        </div>
    );
}
