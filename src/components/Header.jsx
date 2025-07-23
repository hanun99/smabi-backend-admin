import React, { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // Ambil nama pengguna dari localStorage
  useEffect(() => {
    const userLogin = localStorage.getItem("username");
    if (userLogin) {
      setUsername(userLogin);
    } else {
      // Kalau tidak login, arahkan ke login
      navigate("/login");
    }
  }, [navigate]);

  // Logout dan hapus data login
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="md:ml-72 h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-8 flex items-center justify-between shadow-lg fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Kiri: Judul */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Panel Admin
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Selamat datang kembali di dashboard
          </p>
        </div>
      </div>

      {/* Kanan: Notifikasi & User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Profil Pengguna */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800 capitalize">
              {username}
            </p>
            <p className="text-xs text-gray-500">Admin Terdaftar</p>
          </div>

          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=6366F1&color=fff&size=40`}
              alt={username}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-lg"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
        >
          <LogOut
            size={16}
            className="group-hover:rotate-6 transition-transform duration-200"
          />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
