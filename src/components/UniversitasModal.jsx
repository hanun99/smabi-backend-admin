import React, { useState, useEffect } from "react";
import supabase from "../utils/SupaClient";
import { X, Upload, Building2, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

const UniversitasModal = ({ onClose, onSave, isEdit, initialData }) => {
  const [nama, setNama] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setNama(initialData.nama);
      setPreviewUrl(initialData.logo_url || "");
    }
  }, [isEdit, initialData]);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileChange(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      return Swal.fire({
        title: "Gagal",
        text: "Nama universitas wajib diisi",
        icon: "warning",
        customClass: {
          popup: "rounded-xl",
        },
      });
    }

    let logo_url = initialData?.logo_url || "";

    // Upload gambar jika ada file
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `universitas/${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("universitas-images")
        .upload(fileName, file);

      if (error) {
        return Swal.fire({
          title: "Gagal",
          text: "Upload gambar gagal",
          icon: "error",
          customClass: {
            popup: "rounded-xl",
          },
        });
      }

      const { data: publicData } = supabase.storage
        .from("universitas-images")
        .getPublicUrl(fileName);
      logo_url = publicData.publicUrl;
    }

    onSave({ nama, logo_url });
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEdit ? "Edit Universitas" : "Tambah Universitas"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nama Universitas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nama Universitas
            </label>
            <input
              type="text"
              placeholder="Contoh: Universitas Indonesia"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Upload Logo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Logo Universitas
            </label>

            {/* Preview Image */}
            {previewUrl && (
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full bg-gray-100 hidden items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                isDragOver
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG hingga 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversitasModal;
