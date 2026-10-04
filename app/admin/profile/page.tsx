"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PROFILE_BUCKET = "portfolio-profile";
const PROFILE_FILE = "subayu.jpg";

export default function ProfileAdminPage() {
  const supabase = createClient();

  const [imageUrl, setImageUrl] = useState(
    "https://tuujechiaffaewblzyqh.supabase.co/storage/v1/object/public/portfolio-profile/subayu.jpg"
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setMessage("Session login tidak ditemukan. Silakan login kembali.");
    return;
  }

  console.log("PROFILE UPLOAD USER:", user.email);

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 5 MB.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const { error: uploadError } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(PROFILE_FILE, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(uploadError);
        setMessage(uploadError.message);
        return;
      }

      const newUrl =
        `https://tuujechiaffaewblzyqh.supabase.co/storage/v1/object/public/` +
        `${PROFILE_BUCKET}/${PROFILE_FILE}?t=${Date.now()}`;

      setImageUrl(newUrl);
      setMessage("Foto profil berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    try {
      setUploading(true);
      setMessage("");

      const { error } = await supabase.storage
        .from(PROFILE_BUCKET)
        .remove([PROFILE_FILE]);

      if (error) {
        console.error(error);
        setMessage(error.message);
        return;
      }

      setImageUrl("");
      setMessage("Foto profil berhasil dihapus.");
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat menghapus foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Profile
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Kelola foto profil yang ditampilkan di website utama.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-col items-center gap-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Foto profil"
                className="h-40 w-40 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-white/20 text-sm text-white/30">
                Tidak ada foto
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <label className="cursor-pointer rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90">
                {uploading ? "Processing..." : "Ganti Foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>

              {imageUrl && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="rounded-xl border border-red-500/30 px-5 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            {message && (
              <p className="text-center text-sm text-white/60">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}