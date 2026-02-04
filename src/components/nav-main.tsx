import { type Icon } from "@tabler/icons-react";
import {
    IconDashboard,
    IconListDetails,
    IconUsers,
    IconTools,
    IconMail,
} from "@tabler/icons-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const ITEMS: { title: string; url: string; icon?: Icon }[] = [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Appointments", url: "/appointments", icon: IconListDetails },
    { title: "Users", url: "/users", icon: IconUsers },
    { title: "Services", url: "/services", icon: IconTools },
    { title: "Enqiueries", url: "/enqiueries", icon: IconMail },
];

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {ITEMS.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild>
                                <a
                                    href={item.url}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
