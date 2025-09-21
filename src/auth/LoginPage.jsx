import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const daftarPengguna = [
    { username: "Admin", password: "admin123" },
    { username: "Luzman", password: "admin123" },
    { username: "Dewi", password: "admin123" },
    { username: "Ovin", password: "admin123" },
    { username: "Difa", password: "admin123" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userValid = daftarPengguna.find(
      (u) => u.username === username && u.password === password
    );

    if (userValid) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", userValid.username);

      Swal.fire({
        title: `Selamat Datang, ${userValid.username}!`,
        text: "Anda berhasil masuk ke Admin SMABI.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Lanjut ke Dashboard",
        customClass: {
          popup: "rounded-xl shadow-xl",
          confirmButton: "rounded-lg font-medium",
        },
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      Swal.fire({
        title: "Login Gagal",
        text: "Username atau kata sandi salah!",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        customClass: {
          popup: "rounded-xl shadow-xl",
          confirmButton: "rounded-lg font-medium",
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/foto-sekolah.png')" }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang
          </h2>
          <p className="text-gray-500 text-sm">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Nama Pengguna
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan nama pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sedang masuk...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
