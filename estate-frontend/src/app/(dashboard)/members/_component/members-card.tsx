"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetUser } from "@/app/lib/useGetFunctions/useGetUser";
import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";

const roleToLabel = (role: number) => {
    switch (role) {
        case 0:
            return "Admin";
        case 1:
            return "Manager";
        case 2:
            return "User";
        case 3:
            return "Guest";
        case 4:
            return "Blocked";
        default:
            return "Unknown";
    }
};

export const MembersCard = () => {
    const { data: members, isLoading } = useGetUsers();

    if (isLoading) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                    Manage your agency's team members and their roles.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member: any) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between space-x-4"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src="" alt={member.name} />
                                    <AvatarFallback>
                                        {member.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                            <Select
                                defaultValue={roleToLabel(
                                    member.role
                                ).toLowerCase()}
                            >
                                <SelectTrigger
                                    className="ml-auto w-[110px]"
                                    aria-label="Role"
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "Admin",
                                        "Manager",
                                        "User",
                                        "Guest",
                                        "Blocked",
                                    ].map((role) => (
                                        <SelectItem
                                            key={role}
                                            value={role.toLowerCase()}
                                        >
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
