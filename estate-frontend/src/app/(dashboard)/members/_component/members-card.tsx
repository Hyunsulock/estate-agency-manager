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
import { useGetUsers } from "@/app/lib/useGetFunctions/useGetUsers";
import { useUpdateRole } from "@/app/lib/useMutationFunctions/useUpdateRole";

const roleToLabel = (role: number) => {
    switch (role) {
        case 0:
            return "admin";
        case 1:
            return "manager";
        case 2:
            return "user";
        case 3:
            return "guest";
        case 4:
            return "blocked";
        default:
            return "unknown";
    }
};

const labelToRole = (label: string) => {
    switch (label) {
        case "admin":
            return 0;
        case "manager":
            return 1;
        case "user":
            return 2;
        case "guest":
            return 3;
        case "blocked":
            return 4;
        default:
            return 2;
    }
};

export const MembersCard = () => {
    const { data: members, isLoading } = useGetUsers();
    const { mutate: updateRole, isPending } = useUpdateRole();

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
                                defaultValue={roleToLabel(member.role)}
                                onValueChange={(val) =>
                                    updateRole({
                                        id: member.id,
                                        json: { role: labelToRole(val) },
                                    })
                                }
                            >
                                <SelectTrigger
                                    className="ml-auto w-[110px]"
                                    aria-label="Role"
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "admin",
                                        "manager",
                                        "user",
                                        "guest",
                                        "blocked",
                                    ].map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() +
                                                role.slice(1)}
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
