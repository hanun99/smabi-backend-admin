import React, { useEffect, useState } from "react";
import { Eye, Trash2, Star, MessageCircle } from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Testimoni = () => {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimoni();
  }, []);

  const fetchTestimoni = async () => {
    const { data, error } = await supabase
      .from("testimoni")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data testimoni:", error.message);
    } else {
      setDataTestimoni(data);
    }

    setLoading(false);
  };

  const handleLihat = (item) => {
    Swal.fire({
      title: `${item.name}`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Posisi</p>
            <p class="font-medium text-gray-800">${item.posisi}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Rating</p>
            <div class="flex items-center gap-1">
              ${"★".repeat(item.star)}${"☆".repeat(5 - item.star)}
              <span class="ml-2 text-sm text-gray-600">(${item.star}/5)</span>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Testimoni</p>
            <p class="text-gray-800 leading-relaxed">${item.testimoni}</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Tutup",
      width: 600,
      customClass: {
        popup: "rounded-xl",
        title: "text-xl font-semibold text-gray-800",
        confirmButton:
          "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors",
      },
    });
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Testimoni?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg font-medium",
        cancelButton: "rounded-lg font-medium",
      },
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase.from("testimoni").delete().eq("id", id);
      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menghapus testimoni",
          icon: "error",
          customClass: { popup: "rounded-xl" },
        });
      } else {
        setDataTestimoni(dataTestimoni.filter((item) => item.id !== id));
        Swal.fire({
          title: "Berhasil",
          text: "Testimoni berhasil dihapus",
          icon: "success",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating}/5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Testimoni</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Kumpulan testimoni dari alumni dan siswa aktif
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {dataTestimoni.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada testimoni
              </h3>
              <p className="text-gray-500">
                Testimoni akan muncul di sini setelah ditambahkan
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                      <Star size={16} />
                      Rating
                    </h3>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-indigo-700">
                      Nama
                    </h3>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-indigo-700">
                      Posisi
                    </h3>
                  </div>
                  <div className="col-span-4">
                    <h3 className="text-sm font-semibold text-indigo-700">
                      Testimoni
                    </h3>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-indigo-700">
                      Aksi
                    </h3>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {dataTestimoni.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <div className="col-span-2 flex items-center">
                      {renderStars(item.star)}
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.posisi}
                      </span>
                    </div>

                    <div className="col-span-4 flex items-center">
                      <p className="text-gray-700 line-clamp-2 text-sm leading-relaxed">
                        {item.testimoni}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLihat(item)}
                          className="group p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105"
                          title="Lihat Detail"
                        >
                          <Eye
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="group p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105"
                          title="Hapus Testimoni"
                        >
                          <Trash2
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Total testimoni:{" "}
                  <span className="font-semibold">{dataTestimoni.length}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimoni;
