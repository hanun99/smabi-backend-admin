import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Pagination from "../components/Pagination";
import BeritaModal from "../components/BeritaModal";

const Berita = () => {
  const [dataBerita, setDataBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data berita:", error.message);
    } else {
      setDataBerita(data);
    }
    setLoading(false);
  };

  const handleLihat = (berita) => {
    Swal.fire({
      title: berita.judul,
      html: `
        <img src="${berita.image_url}" alt="gambar" class="w-full rounded-lg mb-3" />
        <p>${berita.teks}</p>
        <hr class="my-3"/>
        <p class="text-sm text-gray-500">Dibuat oleh: ${berita.created_by}</p>
      `,
      width: 600,
      confirmButtonText: "Tutup",
    });
  };

  const handleEdit = (id) => {
    const berita = dataBerita.find((b) => b.id === id);
    setIsEdit(true);
    setEditData(berita);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Berita?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) {
        Swal.fire("Gagal", "Berita gagal dihapus", "error");
      } else {
        setDataBerita(dataBerita.filter((item) => item.id !== id));
        Swal.fire("Terhapus", "Berita berhasil dihapus", "success");
      }
    }
  };

  const handleSaveBerita = async (berita) => {
    if (isEdit && editData) {
      const { error } = await supabase
        .from("berita")
        .update(berita)
        .eq("id", editData.id);

      if (error) {
        Swal.fire("Gagal", "Edit berita gagal", "error");
      } else {
        fetchBerita();
        setShowModal(false);
        Swal.fire("Berhasil", "Berita berhasil diupdate", "success");
      }
    } else {
      const { error } = await supabase.from("berita").insert([berita]);
      if (error) {
        Swal.fire("Gagal", "Tambah berita gagal", "error");
      } else {
        fetchBerita();
        setShowModal(false);
        Swal.fire("Berhasil", "Berita berhasil ditambahkan", "success");
      }
    }
  };

  // Filter data berdasarkan search term
  const filteredData = dataBerita.filter(
    (berita) =>
      berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.teks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.created_by.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen  from-slate-50 via-white to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Berita
            </h1>
            <p className="text-slate-600 mt-2">
              Kelola semua berita dengan mudah
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berita..."
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
              <span>Tambah Berita</span>
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
              <p className="text-slate-600">Memuat berita...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Daftar Berita ({filteredData.length})
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
                      Judul
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Konten
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Gambar
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Penulis
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((berita, idx) => (
                    <tr
                      key={berita.id}
                      className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 line-clamp-2 max-w-xs">
                          {berita.judul}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 line-clamp-2 max-w-sm">
                          {berita.teks}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-16 rounded-lg overflow-hidden shadow-md bg-slate-100 flex items-center justify-center">
                            <img
                              src={berita.image_url}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {berita.created_by?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-slate-700 font-medium">
                            {berita.created_by}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleLihat(berita)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(berita.id)}
                            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(berita.id)}
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
                                ? "Tidak ada berita yang ditemukan"
                                : "Tidak ada berita"}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {searchTerm
                                ? "Coba gunakan kata kunci yang berbeda"
                                : "Mulai dengan menambahkan berita pertama"}
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
        <BeritaModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveBerita}
          isEdit={isEdit}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default Berita;
