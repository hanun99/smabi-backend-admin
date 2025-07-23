import React, { useEffect, useState } from "react";
import {
  Settings,
  Shield,
  AlertTriangle,
  Server,
  Check,
  X,
  Loader2,
} from "lucide-react";
import supabase from "../utils/SupaClient";

const Setting = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("pengaturan")
        .select("value")
        .eq("key", "maintenance")
        .single();

      if (error) throw error;

      setMaintenance(data.value); // langsung ambil value dari Supabase
    } catch (err) {
      console.error("Gagal mengambil status maintenance:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = async () => {
    setUpdating(true);
    const newValue = !maintenance;

    try {
      const { error } = await supabase
        .from("pengaturan")
        .update({ value: newValue })
        .eq("key", "maintenance");

      if (error) throw error;

      setMaintenance(newValue);

      // Tambahkan notifikasi atau log
      console.log(`Maintenance ${newValue ? "diaktifkan" : "dinonaktifkan"}`);
    } catch (err) {
      console.error("Gagal memperbarui status:", err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Pengaturan Sistem
          </h1>
          <p className="text-gray-600 text-lg">
            Kelola konfigurasi dan pengaturan sistem administrator
          </p>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-95 border border-white/20">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">
                Konfigurasi Sistem
              </h2>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Maintenance Mode Setting */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        maintenance
                          ? "bg-red-500 shadow-lg shadow-red-500/25"
                          : "bg-green-500 shadow-lg shadow-green-500/25"
                      }`}
                    >
                      {maintenance ? (
                        <AlertTriangle className="w-6 h-6 text-white" />
                      ) : (
                        <Server className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Maintenance Mode
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Kontrol akses website untuk pengguna umum
                      </p>
                    </div>
                  </div>

                  <div className="ml-15">
                    <p className="text-gray-700 mb-4">
                      Saat maintenance mode aktif, website frontend akan
                      menampilkan halaman maintenance dan pengguna tidak dapat
                      mengakses konten utama.
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Status saat ini:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          maintenance
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {maintenance ? (
                          <>
                            <AlertTriangle size={14} />
                            Maintenance Aktif
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            Website Normal
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={toggleMaintenance}
                    disabled={updating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      maintenance
                        ? "bg-red-500 focus:ring-red-500"
                        : "bg-gray-300 focus:ring-blue-500"
                    } ${
                      updating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <span className="sr-only">Toggle maintenance mode</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ease-in-out ${
                        maintenance ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>

                  {updating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengupdate...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Settings Placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* System Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Sistem
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versi Admin</span>
                    <span className="text-gray-900 font-medium">v1.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="text-gray-900 font-medium">
                      SupabaseAdmin
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Keamanan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SSL Certificate</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <Check size={12} />
                      Aktif
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Firewall</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <Check size={12} />
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {maintenance && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Peringatan: Maintenance Mode Aktif
                </h3>
                <p className="text-red-700">
                  Website frontend saat ini dalam mode maintenance. Pengguna
                  umum tidak dapat mengakses konten website dan akan melihat
                  halaman maintenance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
