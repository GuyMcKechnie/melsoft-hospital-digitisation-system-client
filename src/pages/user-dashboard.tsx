import React from "react";
import { Link } from "react-router-dom";

const UserDashboard: React.FC = () => {
    return (
        <div className="p-10 max-w-[1200px] mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-gray-600">Nontokozo Mbatha</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border rounded-xl p-6">
                    <p className="text-sm text-gray-500 mb-1">
                        Next Appointment
                    </p>
                    <h2 className="text-xl font-semibold">30 Jan 2026</h2>
                    <p className="text-sm text-gray-500">10:30 AM</p>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    <p className="text-sm text-gray-500 mb-1">
                        Medical Records
                    </p>
                    <h2 className="text-xl font-semibold">6 Records</h2>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    <p className="text-sm text-gray-500 mb-1">Account Status</p>
                    <h2 className="text-xl font-semibold text-green-600">
                        Active
                    </h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Upcoming Appointment */}
                <div className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Upcoming Appointment
                    </h2>

                    <div className="space-y-2 text-sm text-gray-700">
                        <p>
                            <strong>Date:</strong> 30 January 2026
                        </p>
                        <p>
                            <strong>Time:</strong> 10:30 AM
                        </p>
                        <p>
                            <strong>Doctor:</strong> Dr. Nkosi
                        </p>
                        <p>
                            <strong>Department:</strong> General Medicine
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="text-green-600 font-medium">
                                Confirmed
                            </span>
                        </p>
                    </div>

                    <Link
                        to="/appointments"
                        className="inline-block mt-4 text-sm font-medium text-black underline"
                    >
                        View all appointments
                    </Link>
                </div>

                {/* Recent Records */}
                <div className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Medical Records
                    </h2>

                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Type</th>
                                <th className="pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            <tr>
                                <td className="py-2">12 Jan 2026</td>
                                <td>Lab Results</td>
                                <td>
                                    <Link to="/records" className="underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2">05 Jan 2026</td>
                                <td>Prescription</td>
                                <td>
                                    <Link to="/records" className="underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2">20 Dec 2025</td>
                                <td>Visit Summary</td>
                                <td>
                                    <Link to="/records" className="underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Link
                        to="/records"
                        className="inline-block mt-4 text-sm font-medium text-black underline"
                    >
                        View all records
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 flex flex-wrap gap-4">
                <Link
                    to="/appointments/new"
                    className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium"
                >
                    Book Appointment
                </Link>

                <Link
                    to="/profile"
                    className="px-6 py-3 border rounded-lg text-sm font-medium"
                >
                    Update Profile
                </Link>

                <Link
                    to="/logout"
                    className="px-6 py-3 border border-red-500 text-red-500 rounded-lg text-sm font-medium"
                >
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default UserDashboard;
