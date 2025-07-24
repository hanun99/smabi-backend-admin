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
      <div class="text-left space-y-3 text-[0.85rem]">
        <div class="bg-gray-50 p-2.5 rounded-md">
          <p class="text-xs text-gray-600 mb-1">Posisi</p>
          <p class="font-medium text-gray-800">${item.posisi}</p>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-md">
          <p class="text-xs text-gray-600 mb-1">Rating</p>
          <div class="flex items-center gap-1 text-sm">
            ${"★".repeat(item.star)}${"☆".repeat(5 - item.star)}
            <span class="ml-2 text-xs text-gray-600">(${item.star}/5)</span>
          </div>
        </div>
        <div class="bg-gray-50 p-2.5 rounded-md">
          <p class="text-xs text-gray-600 mb-1">Testimoni</p>
          <p class="text-gray-800 leading-snug text-sm">${item.testimoni}</p>
        </div>
      </div>
    `,
      icon: "info",
      confirmButtonText: "Tutup",
      width: 380,
      customClass: {
        popup: "rounded-xl",
        title: "text-base font-semibold text-gray-800",
        confirmButton:
          "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium text-sm",
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
      width: 360,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg font-medium text-sm",
        cancelButton: "rounded-lg font-medium text-sm",
      },
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase.from("testimoni").delete().eq("id", id);
      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menghapus testimoni",
          icon: "error",
          width: 320,
          customClass: { popup: "rounded-xl" },
        });
      } else {
        setDataTestimoni(dataTestimoni.filter((item) => item.id !== id));
        Swal.fire({
          title: "Berhasil",
          text: "Testimoni berhasil dihapus",
          icon: "success",
          width: 320,
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }
          />
        ))}
        <span className="ml-1.5 text-xs text-gray-600 font-medium">
          {rating}/5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-72 sm:w-96 mb-6 sm:mb-8"></div>
              <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 sm:h-16 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg sm:rounded-xl">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Testimoni
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">
            Kumpulan testimoni dari alumni dan siswa aktif
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {dataTestimoni.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Belum ada testimoni
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Testimoni akan muncul di sini setelah ditambahkan
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-3 px-4 py-3">
                    <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                        <Star size={14} />
                        Rating
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-indigo-700">
                        Nama
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-indigo-700">
                        Posisi
                      </h3>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-xs font-semibold text-indigo-700">
                        Testimoni
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-indigo-700">
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
                      className={`grid grid-cols-12 gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <div className="col-span-2 flex items-center">
                        {renderStars(item.star)}
                      </div>

                      <div className="col-span-2 flex items-center">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {item.posisi}
                        </span>
                      </div>

                      <div className="col-span-4 flex items-center">
                        <p className="text-gray-700 line-clamp-2 text-xs leading-relaxed">
                          {item.testimoni}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleLihat(item)}
                            className="group p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105"
                            title="Lihat Detail"
                          >
                            <Eye
                              size={14}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="group p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105"
                            title="Hapus Testimoni"
                          >
                            <Trash2
                              size={14}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {dataTestimoni.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {item.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {item.posisi}
                        </span>
                      </div>
                      <div className="flex gap-1.5 ml-3">
                        <button
                          onClick={() => handleLihat(item)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">{renderStars(item.star)}</div>

                    <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                      {item.testimoni}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600">
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
