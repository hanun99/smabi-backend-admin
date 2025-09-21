import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  MessageSquare,
  Map,
  BarChart2,
  ListChecks,
  Banknote,
  FileText,
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
  { name: "Program", icon: <ListChecks />, path: "/program" },
  { name: "Karya Tulis", icon: <FileText />, path: "/karya-tulis" },
  { name: "Biaya Pendidikan", icon: <Banknote />, path: "/biaya-pendidikan" },
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
      {/* Overlay untuk tampilan mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Tombol Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border border-gray-200 p-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          {isOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar itu sendiri */}
      <aside
        className={`w-72 bg-white text-gray-800 h-screen fixed top-0 left-0 z-40 border-r border-gray-200 shadow-xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header & Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-gray-500 text-sm">SMAIT Baitul 'Ilmi</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu (Scrollable) */}
          <div className="flex-1 overflow-y-auto mt-4 px-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden transform hover:translate-x-1 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-2.5 rounded-lg transition-all duration-200 transform group-hover:scale-105 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-100 group-hover:bg-gray-200 text-gray-500 group-hover:text-gray-800"
                      }`}
                    >
                      {React.cloneElement(item.icon, { size: 20 })}
                    </div>
                    <span
                      className={`font-semibold transition-all ${
                        isActive ? "text-gray-900" : "group-hover:text-gray-900"
                      }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Footer Profil */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow">
                <span className="text-white text-base font-bold">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-800 text-sm font-semibold capitalize">
                  {username}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
