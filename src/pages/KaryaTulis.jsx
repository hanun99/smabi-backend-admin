import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Pagination from "../components/Pagination";
import KaryaTulisModal from "../components/KaryaTulisModal";

const KaryaTulis = () => {
  const [dataKaryaTulis, setDataKaryaTulis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchKaryaTulis();
  }, []);

  const fetchKaryaTulis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("karya_tulis")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data karya tulis:", error.message);
        Swal.fire("Error", `Gagal mengambil data: ${error.message}`, "error");
      } else {
        setDataKaryaTulis(data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengambil data", "error");
    }
    setLoading(false);
  };

  const handleLihat = (karyaTulis) => {
    Swal.fire({
      title: karyaTulis.title,
      html: `
        <img src="${karyaTulis.image_url}" alt="gambar" class="w-full rounded-lg mb-3" />
        <p class="text-sm text-left mb-2"><strong>Penulis:</strong> ${karyaTulis.author}</p>
        <p class="text-sm text-left">${karyaTulis.description}</p>
      `,
      width: 450,
      confirmButtonText: "Tutup",
      customClass: {
        popup: "rounded-xl",
        title: "text-base font-semibold text-gray-800",
        confirmButton:
          "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium text-sm",
      },
    });
  };

  const handleEdit = (id) => {
    const karyaTulis = dataKaryaTulis.find((k) => k.id === id);
    if (karyaTulis) {
      setIsEdit(true);
      setEditData(karyaTulis);
      setShowModal(true);
    } else {
      Swal.fire("Error", "Data karya tulis tidak ditemukan", "error");
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Karya Tulis?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
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
      try {
        const { error } = await supabase
          .from("karya_tulis")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Delete error:", error);
          Swal.fire(
            "Gagal",
            `Karya tulis gagal dihapus: ${error.message}`,
            "error"
          );
        } else {
          setDataKaryaTulis(dataKaryaTulis.filter((item) => item.id !== id));
          Swal.fire({
            title: "Terhapus",
            text: "Karya tulis berhasil dihapus",
            icon: "success",
            width: 320,
            customClass: { popup: "rounded-xl" },
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus karya tulis",
          "error"
        );
      }
    }
  };

  const handleSaveKaryaTulis = async (karyaTulisData) => {
    try {
      if (isEdit && editData) {
        // UPDATE
        const { data: updatedData, error } = await supabase
          .from("karya_tulis")
          .update({
            title: karyaTulisData.title,
            description: karyaTulisData.description,
            image_url: karyaTulisData.image_url,
            author: karyaTulisData.author,
          })
          .eq("id", editData.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          Swal.fire(
            "Gagal",
            `Edit karya tulis gagal: ${error.message}`,
            "error"
          );
        } else {
          // Update state local dengan data baru
          setDataKaryaTulis((prevData) =>
            prevData.map((item) =>
              item.id === editData.id ? { ...item, ...karyaTulisData } : item
            )
          );

          // Atau refresh data dari server
          await fetchKaryaTulis();

          setShowModal(false);
          setIsEdit(false);
          setEditData(null);
          Swal.fire({
            title: "Berhasil",
            text: "Karya tulis berhasil diupdate",
            icon: "success",
            width: 320,
            customClass: { popup: "rounded-xl" },
          });
        }
      } else {
        // INSERT - untuk data baru
        const { data: newData, error } = await supabase
          .from("karya_tulis")
          .insert([
            {
              title: karyaTulisData.title,
              description: karyaTulisData.description,
              image_url: karyaTulisData.image_url,
              author: karyaTulisData.author,
            },
          ])
          .select();

        if (error) {
          console.error("Insert error:", error);
          Swal.fire(
            "Gagal",
            `Tambah karya tulis gagal: ${error.message}`,
            "error"
          );
        } else {
          // Refresh data dari server
          await fetchKaryaTulis();

          setShowModal(false);
          Swal.fire({
            title: "Berhasil",
            text: "Karya tulis berhasil ditambahkan",
            icon: "success",
            width: 320,
            customClass: { popup: "rounded-xl" },
          });
        }
      }
    } catch (error) {
      console.error("Save karya tulis error:", error);
      Swal.fire(
        "Error",
        "Terjadi kesalahan saat menyimpan karya tulis",
        "error"
      );
    }
  };

  // Reset modal state saat tutup
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditData(null);
  };

  // Filter data berdasarkan search term
  const filteredData = dataKaryaTulis.filter(
    (karyaTulis) =>
      karyaTulis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      karyaTulis.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      karyaTulis.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset ke halaman 1 ketika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen from-slate-50 via-white to-slate-100 p-3 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Karya Tulis
            </h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Kelola semua karya tulis dengan mudah
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari karya tulis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 sm:py-2.5 w-full sm:w-56 lg:w-64 bg-white border border-slate-200 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setIsEdit(false);
                setEditData(null);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Karya Tulis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 text-sm sm:text-base">
                Memuat karya tulis...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-800">
                    Daftar Karya Tulis ({filteredData.length})
                  </h2>
                  <div className="text-xs text-slate-600">
                    Hal {currentPage}/{totalPages}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="divide-y divide-slate-100">
                {paginatedData.map((karyaTulis) => (
                  <div
                    key={karyaTulis.id}
                    className="p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden shadow-sm bg-slate-100 flex-shrink-0">
                        <img
                          src={karyaTulis.image_url}
                          alt="gambar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-slate-400 text-xs">
                          No Image
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
                          {karyaTulis.title}
                        </h3>
                        <p className="text-slate-500 text-xs mb-1">
                          Oleh: {karyaTulis.author}
                        </p>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-3">
                          {karyaTulis.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleLihat(karyaTulis)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Lihat"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(karyaTulis.id)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(karyaTulis.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium text-sm">
                          {searchTerm
                            ? "Tidak ada karya tulis yang ditemukan"
                            : "Tidak ada karya tulis"}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {searchTerm
                            ? "Coba gunakan kata kunci yang berbeda"
                            : "Mulai dengan menambahkan karya tulis pertama"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Daftar Karya Tulis ({filteredData.length})
                  </h2>
                  <div className="text-sm text-slate-600">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Judul
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Penulis
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Gambar
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((karyaTulis, idx) => (
                      <tr
                        key={karyaTulis.id}
                        className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 line-clamp-2 max-w-xs text-sm">
                            {karyaTulis.title}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-600 text-sm">
                            {karyaTulis.author}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-600 line-clamp-2 max-w-sm text-sm">
                            {karyaTulis.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <div className="w-20 h-14 rounded-lg overflow-hidden shadow-md bg-slate-100 flex items-center justify-center">
                              <img
                                src={karyaTulis.image_url}
                                alt="gambar"
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div className="hidden w-full h-full items-center justify-center text-slate-400 text-xs">
                                No Image
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleLihat(karyaTulis)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                              title="Lihat"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEdit(karyaTulis.id)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(karyaTulis.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium">
                                {searchTerm
                                  ? "Tidak ada karya tulis yang ditemukan"
                                  : "Tidak ada karya tulis"}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {searchTerm
                                  ? "Coba gunakan kata kunci yang berbeda"
                                  : "Mulai dengan menambahkan karya tulis pertama"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="mt-4 sm:mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <KaryaTulisModal
          onClose={handleCloseModal}
          onSave={handleSaveKaryaTulis}
          isEdit={isEdit}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default KaryaTulis;
