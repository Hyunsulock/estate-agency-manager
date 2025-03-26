
import { Navbar } from "@/components/navbar";
import { Siderbar } from "@/components/sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { cookies } from "next/headers";
import { SiteHeader } from "../components/site-header";
import { CreateHousePropertyModal } from "@/components/modal/createHousePropertyModal";
import useSocket from "../lib/useSocket";
import { GlobalSocketListener } from "../components/globalSocketListener";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    const session = await getServerSession(authOptions);

    if (!session?.agency) {
        console.log(session);
        redirect("/join-agency");
    }

    console.log("reloading dashboard");


    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
                <CreateHousePropertyModal />
                <GlobalSocketListener />
                <SiteHeader />
                <div className="flex w-full h-full">
                    <div className="w-full">
                        <div className="mx-auto h-full">
                            <main className="h-full py-4 px-6 flex flex-col">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
