import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

type RootLayoutProps = {
    children: ReactNode;
    sidebarProps?: React.ComponentProps<typeof Sidebar>;
};

export default function RootLayout({
    children,
    sidebarProps,
}: RootLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex">
                <AppSidebar {...(sidebarProps ?? ({} as any))} />
                <div className="flex-1">{children}</div>
                <Toaster />
            </div>
        </SidebarProvider>
    );
}
