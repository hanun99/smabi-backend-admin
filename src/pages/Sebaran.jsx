import React, { useEffect, useState } from "react";
import supabase from "../utils/SupaClient";
import UniversitasModal from "../components/UniversitasModal";
import {
  Pencil,
  Trash2,
  Plus,
  GraduationCap,
  MapPin,
  Building2,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Sebaran = () => {
  const [dataUniv, setDataUniv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchUniversitas();
  }, []);

  const fetchUniversitas = async () => {
    const { data, error } = await supabase
      .from("universitas")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setDataUniv(data);
    }

    setLoading(false);
  };

  const handleSave = async (data) => {
    if (editData) {
      // Edit
      const { error } = await supabase
        .from("universitas")
        .update(data)
        .eq("id", editData.id);

      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Gagal mengedit universitas",
          icon: "error",
          customClass: {
            popup: "rounded-xl",
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium",
          },
        });
      } else {
        fetchUniversitas();
        Swal.fire({
          title: "Berhasil",
          text: "Universitas berhasil diupdate",
          icon: "success",
          customClass: {
            popup: "rounded-xl",
            confirmButton:
              "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium",
          },
        });
      }
    } else {
      // Tambah
      const { error } = await supabase.from("universitas").insert(data);
      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menambahkan universitas",
          icon: "error",
          customClass: {
            popup: "rounded-xl",
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium",
          },
        });
      } else {
        fetchUniversitas();
        Swal.fire({
          title: "Berhasil",
          text: "Universitas berhasil ditambahkan",
          icon: "success",
          customClass: {
            popup: "rounded-xl",
            confirmButton:
              "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium",
          },
        });
      }
    }

    setShowModal(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Universitas?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
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
      const { error } = await supabase
        .from("universitas")
        .delete()
        .eq("id", id);
      if (error) {
        Swal.fire({
          title: "Gagal",
          text: "Universitas gagal dihapus",
          icon: "error",
          customClass: { popup: "rounded-xl" },
        });
      } else {
        setDataUniv(dataUniv.filter((item) => item.id !== id));
        Swal.fire({
          title: "Terhapus",
          text: "Universitas berhasil dihapus",
          icon: "success",
          customClass: { popup: "rounded-xl" },
        });
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
        <Building2 className="w-12 h-12 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Belum ada universitas
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Tambahkan universitas pertama untuk mulai mengelola data sebaran alumni
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
      >
        <Plus size={18} />
        Tambah Universitas
      </button>
    </div>
  );

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Sebaran Universitas
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin size={16} />
                  Data sebaran alumni ke berbagai universitas di Indonesia
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus size={18} />
              Tambah Universitas
            </button>
          </div>

          {/* Stats */}
          {!loading && dataUniv.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Universitas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dataUniv.length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Terakhir diperbarui</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : dataUniv.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {dataUniv.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl p-6 transition-all duration-300 hover:scale-105 hover:border-indigo-300"
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      {/* Logo */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-gray-100 group-hover:ring-indigo-100 transition-all duration-300">
                          <img
                            src={item.logo_url}
                            alt={item.nama}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-16 h-16 bg-indigo-100 rounded-full hidden items-center justify-center">
                            <Building2 className="w-8 h-8 text-indigo-600" />
                          </div>
                        </div>
                      </div>

                      {/* University Name */}
                      <h3 className="font-semibold text-gray-900 mb-4 text-sm leading-tight flex-grow">
                        {item.nama}
                      </h3>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex gap-2 transition-all duration-300">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setShowModal(true);
                          }}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 hover:scale-110"
                          title="Edit Universitas"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-110"
                          title="Hapus Universitas"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UniversitasModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          isEdit={!!editData}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default Sebaran;
