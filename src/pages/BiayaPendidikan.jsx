import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Pagination from "../components/Pagination";
import BiayaProgramModal from "../components/BiayaPendidikanModal";

const BiayaPendidikan = () => {
  const [dataBiaya, setDataBiaya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBiayaProgram();
  }, []);

  const fetchBiayaProgram = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("biaya_pendidikan")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data biaya program:", error.message);
        Swal.fire("Error", `Gagal mengambil data: ${error.message}`, "error");
      } else {
        setDataBiaya(data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengambil data", "error");
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLihat = (biaya) => {
    let itemsList = "";
    if (biaya.items && biaya.items.length > 0) {
      itemsList = biaya.items
        .map((item) => `<li class="mb-1">• ${item}</li>`)
        .join("");
    }

    Swal.fire({
      title: biaya.title,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <h4 class="font-semibold text-lg text-green-600 mb-2">Harga: ${formatCurrency(
              biaya.price
            )}</h4>
          </div>
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Deskripsi:</h4>
            <p class="text-gray-700">${
              biaya.description || "Tidak ada deskripsi"
            }</p>
          </div>
          ${
            itemsList
              ? `
            <div>
              <h4 class="font-semibold mb-2">Item yang Termasuk:</h4>
              <ul class="text-gray-700 text-sm">
                ${itemsList}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      `,
      width: 600,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#6366f1",
    });
  };

  const handleEdit = (id) => {
    const biaya = dataBiaya.find((b) => b.id === id);
    if (biaya) {
      setIsEdit(true);
      setEditData(biaya);
      setShowModal(true);
    } else {
      Swal.fire("Error", "Data biaya program tidak ditemukan", "error");
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Biaya Program?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        const { error } = await supabase
          .from("biaya_pendidikan")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Delete error:", error);
          Swal.fire(
            "Gagal",
            `Biaya program gagal dihapus: ${error.message}`,
            "error"
          );
        } else {
          setDataBiaya(dataBiaya.filter((item) => item.id !== id));
          Swal.fire("Terhapus", "Biaya program berhasil dihapus", "success");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus biaya program",
          "error"
        );
      }
    }
  };

  const handleSaveBiaya = async (biayaData) => {
    try {
      if (isEdit && editData) {
        // UPDATE
        const { data: updatedData, error } = await supabase
          .from("biaya_pendidikan")
          .update({
            title: biayaData.title,
            price: biayaData.price,
            description: biayaData.description,
            items: biayaData.items,
          })
          .eq("id", editData.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          Swal.fire(
            "Gagal",
            `Edit biaya program gagal: ${error.message}`,
            "error"
          );
        } else {
          // Update state local dengan data baru
          setDataBiaya((prevData) =>
            prevData.map((item) =>
              item.id === editData.id ? { ...item, ...biayaData } : item
            )
          );

          // Atau refresh data dari server
          await fetchBiayaProgram();

          setShowModal(false);
          setIsEdit(false);
          setEditData(null);
          Swal.fire("Berhasil", "Biaya program berhasil diupdate", "success");
        }
      } else {
        // INSERT - untuk data baru
        const { data: newData, error } = await supabase
          .from("biaya_pendidikan")
          .insert([
            {
              title: biayaData.title,
              price: biayaData.price,
              description: biayaData.description,
              items: biayaData.items,
            },
          ])
          .select();

        if (error) {
          console.error("Insert error:", error);
          Swal.fire(
            "Gagal",
            `Tambah biaya program gagal: ${error.message}`,
            "error"
          );
        } else {
          // Refresh data dari server
          await fetchBiayaProgram();

          setShowModal(false);
          Swal.fire(
            "Berhasil",
            "Biaya program berhasil ditambahkan",
            "success"
          );
        }
      }
    } catch (error) {
      console.error("Save biaya program error:", error);
      Swal.fire(
        "Error",
        "Terjadi kesalahan saat menyimpan biaya program",
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
  const filteredData = dataBiaya.filter(
    (biaya) =>
      biaya.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biaya.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biaya.price?.toString().includes(searchTerm)
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
    <div className="min-h-screen from-slate-50 via-white to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Biaya Pendidikan
            </h1>
            <p className="text-slate-600 mt-2">
              Kelola semua biaya program pendidikan dengan mudah
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari biaya program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setIsEdit(false);
                setEditData(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Biaya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600">Memuat biaya program...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Daftar Biaya Program ({filteredData.length})
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
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Judul Program
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Deskripsi
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Items
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((biaya, idx) => (
                    <tr
                      key={biaya.id}
                      className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 line-clamp-2 max-w-xs">
                          {biaya.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(biaya.price)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 line-clamp-2 max-w-sm">
                          {biaya.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600">
                          {biaya.items && biaya.items.length > 0 ? (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {biaya.items.length} item
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Tidak ada item
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleLihat(biaya)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(biaya.id)}
                            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(biaya.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
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
                                ? "Tidak ada biaya program yang ditemukan"
                                : "Tidak ada biaya program"}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {searchTerm
                                ? "Coba gunakan kata kunci yang berbeda"
                                : "Mulai dengan menambahkan biaya program pertama"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BiayaProgramModal
          onClose={handleCloseModal}
          onSave={handleSaveBiaya}
          isEdit={isEdit}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default BiayaPendidikan;
