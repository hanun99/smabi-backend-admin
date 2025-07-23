import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  MessageSquare,
  Map,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { name: "Alumni", icon: <Users />, path: "/alumni" },
  { name: "Berita", icon: <Newspaper />, path: "/berita" },
  { name: "Testimoni", icon: <MessageSquare />, path: "/testimoni" },
  { name: "Sebaran Universitas", icon: <Map />, path: "/sebaran" },
  { name: "Analytics", icon: <BarChart2 />, path: "/analytics" },
  { name: "Setting", icon: <Settings />, path: "/setting" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border border-gray-300 p-2 rounded-lg shadow-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-72 bg-white text-gray-800 h-screen fixed top-0 left-0 z-40 border-r border-gray-200 shadow transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                SMAIT Baitul 'Ilmi
              </h1>
              <p className="text-gray-500 text-sm">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm border border-blue-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    {React.cloneElement(item.icon, { size: 18 })}
                  </div>
                  <span
                    className={`font-medium transition-all ${
                      isActive ? "text-gray-900" : "group-hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium capitalize">
                {username}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
