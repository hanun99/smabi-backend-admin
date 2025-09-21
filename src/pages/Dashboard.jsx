import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import supabase from "../utils/SupaClient"; // Asumsi path ini sudah benar

// Komponen Card yang dioptimalkan untuk tampilan lebih bersih
const DashboardCard = ({ title, count, icon: Icon, color, description }) => (
  <div
    className={`relative rounded-2xl p-6 shadow-xl transition-all duration-300 transform-gpu hover:scale-[1.02] overflow-hidden`}
    style={{
      background: `linear-gradient(to bottom right, #ffffff, ${color}33)`, // Tambahan gradien ringan
    }}
  >
    {/* Icon dengan background circle */}
    <div
      className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center`}
      style={{ backgroundColor: color + "22" }}
    >
      <Icon className="w-6 h-6" style={{ color: color }} />
    </div>

    {/* Konten teks */}
    <div className="flex flex-col">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-1 text-gray-800">
        {count.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  </div>
);

// Komponen utama Dashboard
const Dashboard = () => {
  const [totals, setTotals] = useState({
    alumni: 0,
    berita: 0,
    testimoni: 0,
    universitas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const tables = ["alumni", "berita", "testimoni", "universitas"];
      const counts = {};

      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });

          if (error) throw error;
          counts[table] = count;
        } catch (error) {
          console.error(`Error fetching ${table}:`, error.message);
          counts[table] = 0;
        }
      }

      setTotals(counts);
    };

    fetchData();
  }, []);

  // Data card dengan palet warna baru
  const cardData = [
    {
      title: "Total Alumni",
      count: totals.alumni,
      icon: Users,
      color: "#3B82F6", // Biru (blue-500)
      description: "Alumni terdaftar",
    },
    {
      title: "Total Berita",
      count: totals.berita,
      icon: FileText,
      color: "#10B981", // Hijau (emerald-500)
      description: "Artikel dipublikasi",
    },
    {
      title: "Total Testimoni",
      count: totals.testimoni,
      icon: MessageSquare,
      color: "#F59E0B", // Kuning (amber-500)
      description: "Testimoni diterima",
    },
    {
      title: "Sebaran Universitas",
      count: totals.universitas,
      icon: GraduationCap,
      color: "#8B5CF6", // Ungu (purple-500)
      description: "Universitas terdaftar",
    },
  ];

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan tampilan lebih elegan */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm font-medium text-gray-500">
                Statistik Umum Sistem
              </p>
            </div>
          </div>
        </div>

        {/* Grid Stats yang lebih rapi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>

        {/* Informasi Tambahan */}
        <div className="mt-8 bg-white rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Informasi Sistem
          </h3>
          <p className="text-gray-500 text-sm">
            Data diperbarui secara otomatis. Pastikan koneksi internet stabil
            untuk mendapatkan data terbaru.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
