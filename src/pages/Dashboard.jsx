import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import supabase from "../utils/SupaClient";

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
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error(`Error fetching ${table}:`, error.message);
          counts[table] = 0;
        } else {
          counts[table] = count;
        }
      }

      setTotals(counts);
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Alumni",
      count: totals.alumni,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Alumni terdaftar",
    },
    {
      title: "Total Berita",
      count: totals.berita,
      icon: FileText,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Artikel dipublikasi",
    },
    {
      title: "Total Testimoni",
      count: totals.testimoni,
      icon: MessageSquare,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "Testimoni diterima",
    },
    {
      title: "Sebaran Universitas",
      count: totals.universitas,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Universitas terdaftar",
    },
  ];

  return (
    <div className="min-h-screen from-slate-50 via-white to-slate-100 p-2 sm:p-3 md:p-4">
      <div className=" mx-auto w-full">
        {/* Header - Lebih Kompak */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 text-xs font-medium">
                Statistik Umum Sistem
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Spacing Dikurangi */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>

        {/* Additional Info - Lebih Kecil */}
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow border border-white/20">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Informasi Sistem
          </h3>
          <p className="text-gray-600 text-xs">
            Data diperbarui secara real-time dari database. Refresh halaman
            untuk mendapatkan data terbaru.
          </p>
        </div>
      </div>
    </div>
  );
};

const Card = ({
  title,
  count,
  icon: Icon,
  color,
  bgColor,
  iconColor,
  description,
}) => (
  <div className="group relative overflow-hidden">
    {/* Background gradient */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
    />

    {/* Card - Padding Dikurangi */}
    <div className="relative bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-md border border-white/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Icon - Ukuran Dikecilkan */}
      <div
        className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </h3>

        <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
          {count.toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>

      {/* Decorative - Ukuran Dikurangi */}
      <div
        className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`}
      />
    </div>
  </div>
);

export default Dashboard;
