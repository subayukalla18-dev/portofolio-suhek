"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Certificate = {
  id: number;
  provider: string;
  title: string;
  category: string | null;
  detail: string | null;
  image_url: string | null;
  certificate_url: string | null;
  year: number | null;
  sort_order: number;
  is_published: boolean;
};

type Props = {
  certificate: Certificate;
};

export default function CertificateForm({ certificate }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    provider: certificate.provider,
    title: certificate.title,
    category: certificate.category ?? "",
    detail: certificate.detail ?? "",
    image_url: certificate.image_url ?? "",
    certificate_url: certificate.certificate_url ?? "",
    year: certificate.year?.toString() ?? "",
    sort_order: certificate.sort_order.toString(),
    is_published: certificate.is_published,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function uploadImage(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `certificate-${certificate.id}-${Date.now()}.${extension}`;
    const filePath = `certificates/${fileName}`;

    const { error } = await supabase.storage
      .from("portfolio-certificates")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("portfolio-certificates")
      .getPublicUrl(filePath);

    return {
      publicUrl: data.publicUrl,
      filePath,
    };
  }

  async function deleteStorageImage(imageUrl: string) {
    const marker = "/storage/v1/object/public/portfolio-certificates/";

    if (!imageUrl.includes(marker)) {
      return;
    }

    const filePath = imageUrl.split(marker)[1];

    if (!filePath) {
      return;
    }

    const { error } = await supabase.storage
      .from("portfolio-certificates")
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete old image:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.provider.trim() || !form.title.trim()) {
      alert("Provider dan title wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image_url.trim();
      let newImagePath: string | null = null;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);

        imageUrl = uploaded.publicUrl;
        newImagePath = uploaded.filePath;
      }

      const { error } = await supabase
  .from("certificates")
  .update({
    provider: form.provider.trim(),
    title: form.title.trim(),
    category: form.category.trim() || null,
    detail: form.detail.trim() || null,
    image_url: imageUrl || null,
    certificate_url: form.certificate_url.trim() || null,
    year: form.year ? Number(form.year) : null,
    sort_order: Number(form.sort_order) || 0,
    is_published: form.is_published,
    updated_at: new Date().toISOString(),
  })
  .eq("id", certificate.id);

if (error) {
  console.error("=== CERTIFICATE UPDATE ERROR ===");
  console.error("message:", error.message);
  console.error("details:", error.details);
  console.error("hint:", error.hint);
  console.error("code:", error.code);

  if (newImagePath) {
    await supabase.storage
      .from("portfolio-certificates")
      .remove([newImagePath]);
  }

  throw error;
}

      if (
        imageFile &&
        certificate.image_url &&
        certificate.image_url !== imageUrl
      ) {
        await deleteStorageImage(certificate.image_url);
      }

      alert("Certificate berhasil diperbarui.");

      router.push("/admin/certificates");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui certificate.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#080808]/70 p-6"
    >
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Provider
            </label>

            <input
              name="provider"
              value={form.provider}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/50">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Category
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/50">
              Year
            </label>

            <input
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/50">
            Detail
          </label>

          <textarea
            name="detail"
            value={form.detail}
            onChange={handleChange}
            rows={5}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-white/25"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Image URL
            </label>

            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/50">
              Certificate URL
            </label>

            <input
              name="certificate_url"
              value={form.certificate_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>
        </div>

        {form.image_url && (
          <div>
            <p className="mb-2 text-xs text-white/40">Current Image</p>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
              <img
                src={form.image_url}
                alt={form.title}
                className="max-h-[350px] w-full object-contain"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs text-white/50">
            Replace Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/50 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Sort Order
            </label>

            <input
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
            />
          </div>

          <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <input
              name="is_published"
              type="checkbox"
              checked={form.is_published}
              onChange={handleChange}
              className="h-4 w-4 accent-white"
            />

            <span className="text-xs text-white/60">
              Published
            </span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE CHANGES →"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/certificates")}
            className="rounded-full border border-white/10 px-5 py-2.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  );
}