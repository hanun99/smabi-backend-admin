import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Newspaper,
  MessageSquare,
  GraduationCap,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react";
import supabase from "../utils/SupaClient";

const Analytics = () => {
  const [dataAlumni, setDataAlumni] = useState([]);
  const [dataBerita, setDataBerita] = useState([]);
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [dataUniversitas, setDataUniversitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchData("alumni", setDataAlumni),
      fetchData("berita", setDataBerita),
      fetchData("testimoni", setDataTestimoni),
      fetchData("universitas", setDataUniversitas),
    ]);
    setLoading(false);
  };

  const fetchData = async (table, setter) => {
    const monthMap = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      count: 0,
    }));

    const { data, error } = await supabase.from(table).select("created_at");
    if (error) {
      console.error(`Gagal ambil data ${table}:`, error.message);
      return;
    }

    data.forEach((item) => {
      const date = new Date(item.created_at);
      const monthIndex = date.getMonth();
      monthMap[monthIndex].count++;
    });

    setter(monthMap);
  };

  const getTotalCount = (data) =>
    data.reduce((sum, item) => sum + item.count, 0);

  const COLORS = {
    alumni: "#6366f1",
    berita: "#f59e0b",
    testimoni: "#10b981",
    universitas: "#ef4444",
  };

  const PIE_COLORS = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-sm text-gray-600">
            {`${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, description }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-32"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Activity size={16} />
                Analisis data dan statistik perkembangan sekolah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Data tahun {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Alumni"
            value={getTotalCount(dataAlumni)}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            change="+12% dari bulan lalu"
          />
          <StatCard
            title="Total Berita"
            value={getTotalCount(dataBerita)}
            icon={Newspaper}
            color="bg-gradient-to-br from-amber-500 to-orange-600"
            change="+8% dari bulan lalu"
          />
          <StatCard
            title="Total Testimoni"
            value={getTotalCount(dataTestimoni)}
            icon={MessageSquare}
            color="bg-gradient-to-br from-emerald-500 to-green-600"
            change="+15% dari bulan lalu"
          />
          <StatCard
            title="Total Universitas"
            value={getTotalCount(dataUniversitas)}
            icon={GraduationCap}
            color="bg-gradient-to-br from-red-500 to-red-600"
            change="+5% dari bulan lalu"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alumni - Area Chart */}
          <ChartCard
            title="Tren Alumni"
            description="Perkembangan jumlah alumni per bulan"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dataAlumni}>
                <defs>
                  <linearGradient id="colorAlumni" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.alumni}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.alumni}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.alumni}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAlumni)"
                  name="Alumni"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Berita - Line Chart */}
          <ChartCard
            title="Publikasi Berita"
            description="Trend publikasi berita per bulan"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataBerita}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.berita}
                  strokeWidth={3}
                  dot={{ fill: COLORS.berita, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: COLORS.berita }}
                  name="Berita"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Testimoni - Donut Chart */}
          <ChartCard
            title="Distribusi Testimoni"
            description="Sebaran testimoni berdasarkan bulan"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataTestimoni.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={(entry) => `${entry.month}: ${entry.count}`}
                >
                  {dataTestimoni.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Universitas - Bar Chart */}
          <ChartCard
            title="Registrasi Universitas"
            description="Jumlah universitas yang mendaftar per bulan"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataUniversitas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.universitas}
                  radius={[4, 4, 0, 0]}
                  name="Universitas"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
