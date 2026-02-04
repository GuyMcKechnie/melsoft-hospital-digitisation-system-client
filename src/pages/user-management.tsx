import UserManagement from "@/components/user-management";
import { SiteHeader } from "@/components/site-header";
import RootLayout from "@/components/layout";
import { JSX } from "react";

function UserManagementPage(): JSX.Element {
    return (
        <RootLayout>
            <SiteHeader />
            <main className="mx-auto p-6">
                <UserManagement />
            </main>
        </RootLayout>
    );
}

export default UserManagementPage;
