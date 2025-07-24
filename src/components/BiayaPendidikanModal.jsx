import React, { useState, useEffect } from "react";
import { X, FileText, Type, Eye, List, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const BiayaPendidikanModal = ({ onClose, onSave, isEdit, initialData }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setPrice(initialData.price || "");
      setDescription(initialData.description || "");
      setItems(initialData.items || []);
    } else {
      // Reset form untuk add mode
      setTitle("");
      setPrice("");
      setDescription("");
      setItems([]);
      setNewItem("");
    }
  }, [isEdit, initialData]);

  const formatCurrency = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePriceChange = (e) => {
    // Hanya mengizinkan angka
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPrice(value);
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!title.trim() || !price || !description.trim()) {
      return Swal.fire({
        title: "Gagal",
        text: "Judul, harga, dan deskripsi wajib diisi",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
    }

    if (price <= 0) {
      return Swal.fire({
        title: "Gagal",
        text: "Harga harus lebih dari 0",
        icon: "warning",
        confirmButtonColor: "#6366f1",
      });
    }

    setLoading(true);

    try {
      // Siapkan data yang akan disimpan
      const biayaData = {
        title: title.trim(),
        price: parseInt(price),
        description: description.trim(),
        items: items,
      };

      // Panggil callback onSave
      await onSave(biayaData);
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
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isEdit ? "Edit Biaya Program" : "Tambah Biaya Program"}
                </h2>
                <p className="text-sm text-slate-600">
                  {isEdit
                    ? "Perbarui informasi biaya program"
                    : "Buat biaya program baru"}
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
            {/* Judul Program */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Type className="w-4 h-4" />
                Judul Program *
              </label>
              <input
                type="text"
                placeholder="Masukkan judul program..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                disabled={loading}
              />
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                Harga *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  placeholder="0"
                  value={price}
                  onChange={handlePriceChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              {price && (
                <p className="text-sm text-green-600 font-medium">
                  {formatCurrency(parseInt(price) || 0)}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="w-4 h-4" />
                Deskripsi Program *
              </label>
              <textarea
                placeholder="Tulis deskripsi program di sini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 resize-none"
                disabled={loading}
              />
            </div>

            {/* Items */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <List className="w-4 h-4" />
                Item yang Termasuk
              </label>

              {/* Add Item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah item baru..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50"
                  disabled={loading || !newItem.trim()}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <span className="text-slate-700 flex-1">• {item}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Tekan Enter atau klik tombol + untuk menambah item
              </p>
            </div>

            {/* Preview Konten */}
            {(title || description || price) && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Eye className="w-4 h-4" />
                  Preview
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {title && (
                    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                  )}
                  {price && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="font-semibold text-green-600 text-lg">
                        {formatCurrency(parseInt(price) || 0)}
                      </span>
                    </div>
                  )}
                  {description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {description}
                    </p>
                  )}
                  {items.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2">
                        Item yang Termasuk:
                      </h4>
                      <ul className="text-slate-600 text-sm space-y-1">
                        {items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
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

export default BiayaPendidikanModal;
