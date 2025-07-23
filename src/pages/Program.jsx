import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Pagination from "../components/Pagination";
import ProgramModal from "../components/ProgramModal";

const Program = () => {
  const [dataProgram, setDataProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("program_unggulan")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data program:", error.message);
    } else {
      setDataProgram(data);
    }
    setLoading(false);
  };

  const handleLihat = (program) => {
    Swal.fire({
      title: program.nama_program,
      html: `
        <img src="${program.foto_url}" alt="gambar" class="w-full rounded-lg mb-3" />
        <p>${program.deskripsi}</p>
      `,
      width: 600,
      confirmButtonText: "Tutup",
    });
  };

  const handleEdit = (id) => {
    const program = dataProgram.find((p) => p.id === id);
    setIsEdit(true);
    setEditData(program);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Program?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      const { error } = await supabase
        .from("program_unggulan")
        .delete()
        .eq("id", id);
      if (error) {
        Swal.fire("Gagal", "Program gagal dihapus", "error");
      } else {
        setDataProgram(dataProgram.filter((item) => item.id !== id));
        Swal.fire("Terhapus", "Program berhasil dihapus", "success");
      }
    }
  };

  const handleSaveProgram = async (program) => {
    if (isEdit && editData) {
      const { error } = await supabase
        .from("program_unggulan")
        .update(program)
        .eq("id", editData.id);

      if (error) {
        Swal.fire("Gagal", "Edit program gagal", "error");
      } else {
        fetchProgram();
        setShowModal(false);
        Swal.fire("Berhasil", "Program berhasil diupdate", "success");
      }
    } else {
      const { error } = await supabase
        .from("program_unggulan")
        .insert([program]);
      if (error) {
        Swal.fire("Gagal", "Tambah program gagal", "error");
      } else {
        fetchProgram();
        setShowModal(false);
        Swal.fire("Berhasil", "Program berhasil ditambahkan", "success");
      }
    }
  };

  // Filter data berdasarkan search term
  const filteredData = dataProgram.filter(
    (program) =>
      program.nama_program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
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
              Program Unggulan
            </h1>
            <p className="text-slate-600 mt-2">
              Kelola semua program unggulan dengan mudah
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari program..."
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
              <span>Tambah Program</span>
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
              <p className="text-slate-600">Memuat program...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Daftar Program ({filteredData.length})
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
                      Nama Program
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Deskripsi
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Foto
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((program, idx) => (
                    <tr
                      key={program.id}
                      className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 line-clamp-2 max-w-xs">
                          {program.nama_program}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 line-clamp-2 max-w-sm">
                          {program.deskripsi}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-16 rounded-lg overflow-hidden shadow-md bg-slate-100 flex items-center justify-center">
                            <img
                              src={program.foto_url}
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleLihat(program)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(program.id)}
                            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
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
                      <td colSpan="4" className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-600 font-medium">
                              {searchTerm
                                ? "Tidak ada program yang ditemukan"
                                : "Tidak ada program"}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {searchTerm
                                ? "Coba gunakan kata kunci yang berbeda"
                                : "Mulai dengan menambahkan program pertama"}
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
        <ProgramModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveProgram}
          isEdit={isEdit}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default Program;
