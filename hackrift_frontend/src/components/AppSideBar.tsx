import React, { useEffect, useState } from "react";
import { User, Shield, Phone, LucideIcon } from "lucide-react";
import { NavMain } from "@/components/NavMain";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "DBS Vickers",
    email: "info-sg@dbsvonline.com",
    avatar: "",
  });
  const [sidebar, setSidebar] = useState<{ title: string; url: string; icon: LucideIcon; name: string }[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      const userDetails = JSON.parse(localStorage.getItem("user") as string);
      setUser(userDetails);
      setSidebar([
        {
          title: "Fraud Detector",
          url: "/fraudDetector",
          icon: Shield,
          name: "fraudDetector",
        },
        {
          title: "Users",
          url: "/users",
          icon: User,
          name: "users",
        }
      ]);
    }
    else {
        setSidebar([
            {
            title: "Phone Numbers",
            url: "/phoneNumbers",
            icon: Phone,
            name: "phoneNumbers",
            }
        ]);
    }
  }, [location.pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="text-3xl font-semibold"></SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
