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

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    console.log("reloading dashboard");
    // return (
    // <div className="min-h-screen">
    //     <div className="flex w-full h-full">
    //         <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
    //             <Siderbar />
    //         </div>
    //         <div className="lg:pl-[264px] w-full">
    //             <div className="mx-auto max-w-screen-2xl h-full">
    //                 <Navbar />
    //                 <main className="h-full py-8 px-6 flex flex-col">
    //                     {children}
    //                 </main>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    // );
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
                <CreateHousePropertyModal/>
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
