"use client";

import { useEffect, useState } from "react";
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

const supabase = createClient();

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    provider: "",
    title: "",
    category: "",
    detail: "",
    image_url: "",
    certificate_url: "",
    year: "",
    sort_order: "0",
    is_published: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchCertificates() {
    setLoading(true);

    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data certificate.");
    } else {
      setCertificates(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

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
    const fileName = `certificate-${Date.now()}.${extension}`;
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

    return data.publicUrl;
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

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("certificates").insert({
        provider: form.provider.trim(),
        title: form.title.trim(),
        category: form.category.trim() || null,
        detail: form.detail.trim() || null,
        image_url: imageUrl || null,
        certificate_url: form.certificate_url.trim() || null,
        year: form.year ? Number(form.year) : null,
        sort_order: Number(form.sort_order) || 0,
        is_published: form.is_published,
      });

      if (error) {
        throw error;
      }

      setForm({
        provider: "",
        title: "",
        category: "",
        detail: "",
        image_url: "",
        certificate_url: "",
        year: "",
        sort_order: "0",
        is_published: true,
      });

      setImageFile(null);

      const fileInput = document.getElementById(
        "certificate-image",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchCertificates();

      setShowAddForm(false);

      alert("Certificate berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan certificate.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(
    id: number,
    currentStatus: boolean,
  ) {
    const { error } = await supabase
      .from("certificates")
      .update({
        is_published: !currentStatus,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal mengubah status.");
      return;
    }

    fetchCertificates();
  }

  async function deleteCertificate(certificate: Certificate) {
    const confirmed = confirm(
      `Yakin ingin menghapus certificate "${certificate.title}"?`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", certificate.id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus certificate.");
      return;
    }

    if (certificate.image_url) {
      try {
        const marker =
          "/storage/v1/object/public/portfolio-certificates/";

        if (certificate.image_url.includes(marker)) {
          const filePath = certificate.image_url.split(marker)[1];

          await supabase.storage
            .from("portfolio-certificates")
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    fetchCertificates();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
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
              Certificates
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage your certificates and credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                {certificates.length} Certificates
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90"
            >
              {showAddForm ? "CLOSE ×" : "+ ADD CERTIFICATE"}
            </button>
          </div>
        </div>

        {/* ADD FORM */}
        {showAddForm && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#080808]/70 p-6">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                Create
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Add Certificate
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Provider
                  </label>

                  <input
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    placeholder="Digital Talent Scholarship"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                    placeholder="Junior Web Developer"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                    placeholder="Web Development"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                    placeholder="2025"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                  rows={4}
                  placeholder="Certificate description..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
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
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Upload Image
                </label>

                <input
                  id="certificate-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] ?? null)
                  }
                  className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/50 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
                />

                <p className="mt-2 text-[11px] text-white/25">
                  Jika upload gambar digunakan, Image URL akan
                  digantikan.
                </p>
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
                    Publish immediately
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "ADD CERTIFICATE →"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </section>
        )}

        {/* LIST */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                Existing Content
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                All Certificates
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              Loading certificates...
            </div>
          ) : certificates.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              Belum ada certificate.
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((certificate, index) => (
                <article
                  key={certificate.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/70 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row">
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:w-48">
                      {certificate.image_url ? (
                        <img
                          src={certificate.image_url}
                          alt={certificate.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/20">
                          NO IMAGE
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[10px] text-white/25">
                          #{String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${
                            certificate.is_published
                              ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300/70"
                              : "border-white/10 bg-white/[0.03] text-white/30"
                          }`}
                        >
                          {certificate.is_published
                            ? "Published"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                        {certificate.provider}
                        {certificate.year && ` • ${certificate.year}`}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {certificate.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/35">
                        {certificate.detail}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={`/admin/certificates/${certificate.id}/edit`}
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          EDIT
                        </a>

                        <button
                          onClick={() =>
                            togglePublished(
                              certificate.id,
                              certificate.is_published,
                            )
                          }
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          {certificate.is_published
                            ? "UNPUBLISH"
                            : "PUBLISH"}
                        </button>

                        <button
                          onClick={() =>
                            deleteCertificate(certificate)
                          }
                          className="rounded-full border border-red-400/10 px-3.5 py-1.5 text-[11px] text-red-300/50 transition hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-300"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}