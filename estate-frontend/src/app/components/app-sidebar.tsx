"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
    ArrowUpCircleIcon,
    BookUser,
    Building2,
    Calendar,
    FileClock,
    Home,
    Inbox,
    Network,
    PlusCircleIcon,
    ScrollText,
    Search,
    Settings,
    UsersIcon,
} from "lucide-react";
import { NavUser } from "./navUser";
import { useCreateModal } from "@/hooks/useCreateHousePropertyModal";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Deals",
        url: "/Deals",
        icon: ScrollText,
    },
    {
        title: "HouseProperties",
        url: "/houseProperties",
        icon: Building2,
    },
    {
        title: "History",
        url: "/history",
        icon: FileClock,
    },
    {
        title: "Customers",
        url: "/customers",
        icon: BookUser,
    },
    {
        title: "Agencies",
        url: "/agencies",
        icon: Network,
    },
    {
        title: "Members",
        url: "/members",
        icon: UsersIcon,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const { open } = useCreateModal("create-house-property");
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">
                                    Numatas
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton
                                    tooltip="Quick Create"
                                    onClick={open}
                                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                >
                                    <PlusCircleIcon />
                                    <span>Quick Create</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
