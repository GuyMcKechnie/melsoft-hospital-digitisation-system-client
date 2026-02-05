import UserManagement from "@/components/user-management";
import { SiteHeader } from "@/components/site-header";
import RootLayout from "@/components/layout";
import { JSX } from "react";

function UserManagementPage(): JSX.Element {
    return (
        <RootLayout>
            <SiteHeader />

            <main className="mx-auto p-6 max-w-250">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage users, roles and permissions. Create, edit or
                        remove users as needed.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <UserManagement />
                    </section>
                </div>
            </main>
        </RootLayout>
    );
}

export default UserManagementPage;
