"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PROFILE_BUCKET = "portfolio-profile";
const PROFILE_FILE = "subayu.jpg";

export default function ProfileAdminPage() {
  const supabase = createClient();

  const [imageUrl, setImageUrl] = useState(
    "https://tuujechiaffaewblzyqh.supabase.co/storage/v1/object/public/portfolio-profile/subayu.jpg",
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
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
    <main className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="border-b border-white/10 pb-6">
          <a
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 transition hover:text-white"
          >
            ← Back to Dashboard
          </a>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Content Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            Profile
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Manage your profile photo displayed on the website.
          </p>
        </div>

        {/* PROFILE CONTENT */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#080808]/70 p-6">
          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Profile Photo
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Manage Profile Image
            </h2>

            <p className="mt-2 text-sm text-white/35">
              This photo will be displayed on your portfolio homepage.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            {/* IMAGE */}
            <div className="flex shrink-0 justify-center md:justify-start">
              {imageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black p-2">
                  <img
                    src={imageUrl}
                    alt="Foto profil"
                    className="h-48 w-48 rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black text-center text-xs text-white/25">
                  NO PROFILE IMAGE
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90">
                  {uploading ? "PROCESSING..." : "CHANGE PHOTO"}

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
                    className="rounded-full border border-red-400/10 px-5 py-2.5 text-xs text-red-300/60 transition hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    DELETE PHOTO
                  </button>
                )}
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Image Requirements
                </p>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Upload gambar dengan format image. Ukuran maksimal 5 MB.
                </p>
              </div>

              {message && (
                <p className="mt-4 text-sm text-white/60">
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}