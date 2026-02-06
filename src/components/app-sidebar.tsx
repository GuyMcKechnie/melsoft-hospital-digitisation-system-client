import * as React from "react";
import {
    IconDashboard,
    IconHelp,
    IconListDetails,
    IconSearch,
    IconSettings,
    IconTools,
    IconUsers,
    IconMail,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/contexts/auth";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HospitalIcon } from "lucide-react";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { currentUser } = useAuth();

    const adminItems = [
        { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
        { title: "Appointments", url: "/appointments", icon: IconListDetails },
        { title: "Users", url: "/users", icon: IconUsers },
        { title: "Enquiries", url: "/enquiries", icon: IconMail },
    ];

    const patientItems = [
        { title: "Dashboard", url: "/user-dashboard", icon: IconDashboard },
        { title: "Appointments", url: "/appointments", icon: IconListDetails },
        { title: "Services", url: "/services", icon: IconTools },
        { title: "Enquiries", url: "/enquiries", icon: IconMail },
    ];

    const navItems =
        currentUser?.role === "admin"
            ? adminItems
            : currentUser?.role === "patient"
              ? patientItems
              : [];

    const sidebarUser = currentUser
        ? {
              name: currentUser.name || currentUser.email || "User",
              email: currentUser.email || "",
              avatar: (currentUser as any).avatar || "",
          }
        : data.user;

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <HospitalIcon className="size-5!" />
                                <span className="text-base font-semibold">
                                    Hospus
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarUser} />
            </SidebarFooter>
        </Sidebar>
    );
}
