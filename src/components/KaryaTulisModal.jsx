import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image,
  FileText,
  Type,
  Eye,
  User,
  BookOpen,
} from "lucide-react";
import supabase from "../utils/SupaClient";
import Swal from "sweetalert2";

const KaryaTulisModal = ({ onClose, onSave, isEdit, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setAuthor(initialData.author || "");
      setPreviewImage(initialData.image_url || null);
    } else {
      // Reset form untuk add mode
      setTitle("");
      setDescription("");
      setAuthor("");
      setFile(null);
      setPreviewImage(null);
    }
  }, [isEdit, initialData]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewImage(
      isEdit && initialData?.image_url ? initialData.image_url : null
    );
    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!title.trim() || !description.trim() || !author.trim()) {
      return Swal.fire({
        title: "Gagal",
        text: "Judul, deskripsi, dan penulis wajib diisi",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
    }

    // Untuk edit, jika tidak ada gambar baru dan tidak ada gambar lama, minta upload
    if (!isEdit && !file) {
      return Swal.fire({
        title: "Gagal",
        text: "Gambar karya tulis wajib diupload",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
    }

    setLoading(true);

    try {
      let image_url = initialData?.image_url || "";

      // Jika ada file baru yang diupload
      if (file) {
        // Validasi ukuran file
        if (file.size > 100 * 1024 * 1024) {
          setLoading(false);
          return Swal.fire({
            title: "Ukuran Gambar Terlalu Besar",
            text: "Maksimal 100MB",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }

        // Upload file ke Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `karya-tulis/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("karya-tulis-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setLoading(false);
          return Swal.fire({
            title: "Gagal",
            text: `Gagal upload gambar: ${uploadError.message}`,
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }

        // Dapatkan URL publik
        const {
          data: { publicUrl },
        } = supabase.storage.from("karya-tulis-images").getPublicUrl(filePath);

        image_url = publicUrl;
      }

      // Siapkan data yang akan disimpan
      const karyaTulisData = {
        title: title.trim(),
        description: description.trim(),
        author: author.trim(),
        image_url: image_url,
      };

      // Panggil callback onSave
      await onSave(karyaTulisData);
    } catch (error) {
      console.error("Submit error:", error);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan data",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isEdit ? "Edit Karya Tulis" : "Tambah Karya Tulis"}
                </h2>
                <p className="text-sm text-slate-600">
                  {isEdit
                    ? "Perbarui informasi karya tulis"
                    : "Buat karya tulis baru"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
              disabled={loading}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Type className="w-4 h-4" />
                Judul Karya Tulis *
              </label>
              <input
                type="text"
                placeholder="Masukkan judul karya tulis..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>

            {/* Penulis */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4" />
                Penulis *
              </label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             hover:border-blue-400 transition-all duration-200 ease-in-out"
              >
                <option value="">Pilih Penulis</option>
                <option value="Guru">Guru</option>
                <option value="Murid">Murid</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="w-4 h-4" />
                Deskripsi Karya Tulis *
              </label>
              <textarea
                placeholder="Tulis deskripsi karya tulis di sini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 resize-none"
                disabled={loading}
              />
            </div>

            {/* Upload Gambar */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Image className="w-4 h-4" />
                Gambar Karya Tulis {!isEdit && "*"}
              </label>

              {/* Preview Image */}
              {previewImage && (
                <div className="relative">
                  <div className="relative group">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-slate-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Hover pada gambar untuk menghapus
                  </p>
                </div>
              )}

              {/* File Input */}
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="file-input"
                  className={`flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : previewImage
                      ? "border-slate-300 bg-slate-50 hover:bg-slate-100"
                      : "border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
                  }`}
                >
                  <Upload
                    className={`w-5 h-5 ${
                      previewImage ? "text-slate-500" : "text-indigo-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      previewImage ? "text-slate-600" : "text-indigo-600"
                    }`}
                  >
                    {previewImage ? "Ganti Gambar" : "Pilih Gambar"}
                  </span>
                </label>
              </div>

              <p className="text-xs text-slate-500">
                Format: JPG, PNG, JPEG. Maksimal 100MB.
                {!isEdit && " Wajib upload gambar untuk karya tulis baru."}
              </p>
            </div>

            {/* Preview Konten */}
            {(title || description || author) && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Eye className="w-4 h-4" />
                  Preview
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {title && (
                    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                  )}
                  {author && (
                    <p className="text-slate-600 text-sm mb-2">
                      <strong>Oleh:</strong> {author}
                    </p>
                  )}
                  {description && (
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-medium"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEdit ? "Mengupdate..." : "Menyimpan..."}
                  </div>
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KaryaTulisModal;
