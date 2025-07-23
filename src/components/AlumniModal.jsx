import React from "react";
import { X, User, BookOpen, Route, School, Hash } from "lucide-react";

const AlumniModal = ({
  isEdit = false,
  visible,
  onClose,
  onSubmit,
  data,
  onChange,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-lg w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEdit ? "Edit Alumni" : "Tambah Alumni"}
                </h2>
                <p className="text-indigo-100 text-sm">
                  {isEdit ? "Perbarui data alumni" : "Tambah data alumni baru"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-5">
            {/* Nama */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={data.nama}
                onChange={onChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Jurusan */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Jurusan
              </label>
              <input
                type="text"
                name="jurusan"
                value={data.jurusan}
                onChange={onChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Masukkan jurusan"
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Route className="w-4 h-4 text-indigo-600" />
                Jalur Masuk
              </label>
              <select
                name="jalur"
                value={data.jalur}
                onChange={onChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">-- Pilih Jalur Masuk --</option>
                <option value="BEASISWA">BEASISWA</option>
                <option value="SNBT">SNBT</option>
                <option value="MANDIRI">MANDIRI</option>
                <option value="SPAN PTKIN">SPAN PTKIN</option>
              </select>
            </div>

            {/* Universitas */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                Universitas
              </label>
              <input
                type="text"
                name="universitas"
                value={data.universitas}
                onChange={onChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Masukkan nama universitas"
                required
              />
            </div>

            {/* Angkatan */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-600" />
                Angkatan
              </label>
              <input
                type="number"
                name="angkatan"
                value={data.angkatan || ""}
                onChange={onChange}
                min={1}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Contoh: 1"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-lg hover:shadow-xl"
              >
                {isEdit ? "Perbarui" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniModal;
