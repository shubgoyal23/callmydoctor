import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import DoctorDashboard from "./Doctor/DoctorDashboard";
import UserDashboard from "./user/UserDashboard";

export default function Page() {
   const { isDoctor } = useSelector((state: any) => state.user);
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                     orientation="vertical"
                     className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <div>{isDoctor ? "Doctor Dashboard" : "User Dashboard"}</div>
               </div>
            </header>
            <div className="w-full h-full p-4">
               {isDoctor ? <DoctorDashboard /> : <UserDashboard />}
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
