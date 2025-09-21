import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userLogin = localStorage.getItem("username");
    if (userLogin) {
      setUsername(userLogin);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="md:ml-72 h-20 bg-white/70 backdrop-blur-lg border-b border-gray-100 px-6 sm:px-8 flex items-center justify-between shadow-sm fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Kiri: Judul */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Panel Admin
          </h2>
          <p className="text-sm text-gray-500 font-light">
            Selamat datang kembali di dashboard 👋
          </p>
        </div>
      </div>

      {/* Kanan: Profil & Logout */}
      <div className="flex items-center gap-6">
        {/* Profil Pengguna */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-base font-semibold text-gray-800 capitalize">
              {username}
            </p>
            <p className="text-xs text-gray-500 font-light">Admin Terdaftar</p>
          </div>
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=6366F1&color=fff&size=48`}
              alt={username}
              className="w-12 h-12 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-white shadow-lg transition-transform hover:scale-105"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="group hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <LogOut
            size={16}
            className="group-hover:text-red-500 transition-colors"
          />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
