import { Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import ForgotPasswordPage from "./pages/forgot-password";
import AdminDashboard from "./pages/admin-dashboard";
import UserDashboard from "./pages/user-dashboard";
import UsersPage from "./pages/user-management";
import ServicesPage from "./pages/services";
import AppointmentsPage from "./pages/appointments-page";
import EnquiriesPage from "./pages/enquiries-page";
import { useAuth } from "./contexts/auth";

const getDefaultPath = (role?: string) =>
    role === "admin" ? "/dashboard" : "/user-dashboard";

function RequireAuth({
    allowedRoles,
    children,
}: {
    allowedRoles?: string[];
    children: ReactNode;
}) {
    const { currentUser, loading } = useAuth();

    if (loading) return null;
    if (!currentUser) return <Navigate to="/" replace />;

    if (allowedRoles && !allowedRoles.includes(currentUser.role || "")) {
        return <Navigate to={getDefaultPath(currentUser.role)} replace />;
    }

    return <>{children}</>;
}

function RoleRedirect() {
    const { currentUser, loading } = useAuth();

    if (loading) return null;
    if (!currentUser) return <Navigate to="/" replace />;

    return <Navigate to={getDefaultPath(currentUser.role)} replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/appointments"
                element={
                    <RequireAuth allowedRoles={["admin", "patient"]}>
                        <AppointmentsPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/services"
                element={
                    <RequireAuth allowedRoles={["patient"]}>
                        <ServicesPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/enquiries"
                element={
                    <RequireAuth allowedRoles={["admin", "patient"]}>
                        <EnquiriesPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/user-dashboard"
                element={
                    <RequireAuth allowedRoles={["patient"]}>
                        <UserDashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/users"
                element={
                    <RequireAuth allowedRoles={["admin"]}>
                        <UsersPage />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<RoleRedirect />} />
        </Routes>
    );
}

export default App;
