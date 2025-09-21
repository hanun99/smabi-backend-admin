import React, { useEffect, useState } from "react";
import { Eye, Trash2, Star, MessageCircle } from "lucide-react";
import supabase from "../utils/SupaClient"; // Asumsi path ini sudah benar
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Komponen untuk menampilkan bintang rating
const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16} // Ukuran ikon diperbesar sedikit
        className={
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-300"
        }
      />
    ))}
    <span className="ml-2 text-sm text-gray-600 font-medium">({rating}/5)</span>
  </div>
);

// Komponen utama Testimoni
const Testimoni = () => {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimoni();
  }, []);

  const fetchTestimoni = async () => {
    try {
      const { data, error } = await supabase
        .from("testimoni")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setDataTestimoni(data);
    } catch (error) {
      console.error("Gagal mengambil data testimoni:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLihat = (item) => {
    Swal.fire({
      title: `${item.name}`,
      html: `
        <div class="text-left space-y-4 text-sm font-sans text-gray-700">
          <div class="bg-gray-100 p-3 rounded-xl border border-gray-200">
            <p class="text-xs text-gray-500 mb-1 font-medium">Posisi</p>
            <p class="font-semibold text-gray-800">${item.posisi}</p>
          </div>
          <div class="bg-gray-100 p-3 rounded-xl border border-gray-200">
            <p class="text-xs text-gray-500 mb-1 font-medium">Rating</p>
            <div class="flex items-center">
              ${"★".repeat(item.star)}<span class="text-gray-300">${"★".repeat(
        5 - item.star
      )}</span>
              <span class="ml-2 text-xs text-gray-600">(${item.star}/5)</span>
            </div>
          </div>
          <div class="bg-gray-100 p-3 rounded-xl border border-gray-200">
            <p class="text-xs text-gray-500 mb-1 font-medium">Testimoni</p>
            <p class="text-gray-800 leading-relaxed">${item.testimoni}</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Tutup",
      width: 400,
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-xl font-bold text-gray-900",
        confirmButton:
          "bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2 rounded-xl font-semibold text-sm",
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
      width: 380,
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "rounded-xl font-semibold",
        cancelButton: "rounded-xl font-semibold",
      },
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase.from("testimoni").delete().eq("id", id);
      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menghapus testimoni",
          icon: "error",
          width: 350,
          customClass: { popup: "rounded-xl" },
        });
      } else {
        setDataTestimoni(dataTestimoni.filter((item) => item.id !== id));
        Swal.fire({
          title: "Berhasil",
          text: "Testimoni berhasil dihapus",
          icon: "success",
          width: 350,
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  if (loading) {
    // Tampilan loading yang lebih dinamis
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Testimoni</h1>
          </div>
          <p className="text-gray-500 text-lg">
            Kumpulan testimoni dari alumni dan siswa aktif.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {dataTestimoni.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum ada testimoni
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Testimoni yang dikirimkan akan muncul di sini.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4">
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <Star size={16} />
                        Rating
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Nama
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Posisi
                      </h3>
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Testimoni
                      </h3>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-gray-700 text-right">
                        Aksi
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {dataTestimoni.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="col-span-2 flex items-center">
                        <RatingStars rating={item.star} />
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="font-medium text-gray-900 text-base">
                          {item.name}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.posisi}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center">
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {item.testimoni}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleLihat(item)}
                          className="group p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-300 transform hover:scale-105"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="group p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 transform hover:scale-105"
                          title="Hapus Testimoni"
                        >
                          <Trash2 size={16} />
                        </button>
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
                    className="p-5 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                          {item.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.posisi}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => handleLihat(item)}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <RatingStars rating={item.star} />
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {item.testimoni}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Total testimoni:{" "}
                  <span className="font-bold text-gray-800">
                    {dataTestimoni.length}
                  </span>
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
