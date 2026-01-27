import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const Menus = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Appointments", path: "/appointments" },
    { title: "Records", path: "/records" },
    { title: "Logout", path: "/logout" },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-black px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg text-white">
          Hospital System
        </h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm font-medium text-white border border-white/30 px-3 py-1 rounded-md hover:bg-white hover:text-black transition"
        >
          Menu
        </button>
      </div>

      {/* Sidebar / Mobile Menu */}
      <div
        className={`fixed md:static top-0 left-0 h-full bg-black w-64 p-6 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <h2 className="text-xl font-semibold mb-10 hidden md:block text-white">
          Hospital System
        </h2>

        <ul className="space-y-2">
          {Menus.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <li key={menu.title}>
                <Link
                  to={menu.path}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    menu.title === "Logout"
                      ? "text-red-400 hover:bg-red-600 hover:text-white"
                      : isActive
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-white hover:text-black"
                  }`}
                >
                  {menu.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
