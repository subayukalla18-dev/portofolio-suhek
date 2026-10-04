"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Education = {
  id: number;
  institution: string;
  degree: string;
  field: string | null;
  period: string | null;
  status: string | null;
  logo_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export default function EducationAdminPage() {
  const supabase = createClient();

  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    field: "",
    period: "",
    status: "",
    logo_url: "",
    sort_order: 99,
    is_published: true,
  });

  const [file, setFile] = useState<File | null>(null);

  async function loadEducation() {
    setLoading(true);

    const { data, error } = await supabase
      .from("education")
      .select(
        "id, institution, degree, field, period, status, logo_url, sort_order, is_published",
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("FAILED TO FETCH EDUCATION:", error);
    }

    setEducation(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadEducation();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!form.institution.trim()) {
      alert("Institution wajib diisi.");
      return;
    }

    if (!form.degree.trim()) {
      alert("Degree wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      let logoUrl = form.logo_url;

      if (file) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "png";

        const fileName = `education-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-logos")
          .upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          alert("Gagal upload logo.");
          return;
        }

        const { data } = supabase.storage
          .from("portfolio-logos")
          .getPublicUrl(fileName);

        logoUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("education")
        .insert({
          institution: form.institution.trim(),
          degree: form.degree.trim(),
          field: form.field.trim(),
          period: form.period.trim(),
          status: form.status.trim(),
          logo_url: logoUrl.trim(),
          sort_order: Number(form.sort_order),
          is_published: form.is_published,
        });

      if (error) {
        console.error("=== EDUCATION CREATE ERROR ===");
        console.error("message:", error.message);
        console.error("details:", error.details);
        console.error("hint:", error.hint);
        console.error("code:", error.code);

        alert(`Gagal menambahkan education.\n\n${error.message}`);
        return;
      }

      setForm({
        institution: "",
        degree: "",
        field: "",
        period: "",
        status: "",
        logo_url: "",
        sort_order: 99,
        is_published: true,
      });

      setFile(null);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadEducation();

      setShowAddForm(false);

      alert("Education berhasil ditambahkan.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: Education) {
    const { error } = await supabase
      .from("education")
      .update({
        is_published: !item.is_published,
      })
      .eq("id", item.id);

    if (error) {
      console.error("TOGGLE EDUCATION ERROR:", error);
      alert(`Gagal mengubah status.\n\n${error.message}`);
      return;
    }

    await loadEducation();
  }

  async function handleDelete(item: Education) {
    const confirmed = window.confirm(
      `Hapus "${item.institution}"?`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("education")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("DELETE EDUCATION ERROR:", error);
      alert(`Gagal menghapus education.\n\n${error.message}`);
      return;
    }

    await loadEducation();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Content Management
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
              Education
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage your education history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                {education.length} Education
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90"
            >
              {showAddForm ? "CLOSE ×" : "+ ADD EDUCATION"}
            </button>
          </div>
        </div>

        {/* CREATE */}
        {showAddForm && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#080808]/70 p-6">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                Create
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Add Education
              </h2>
            </div>

            <form
              onSubmit={handleCreate}
              className="space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Institution
                  </label>

                  <input
                    placeholder="Universitas Teknokrat Indonesia"
                    value={form.institution}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institution: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Degree
                  </label>

                  <input
                    placeholder="S1"
                    value={form.degree}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        degree: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Field
                  </label>

                  <input
                    placeholder="Informatika"
                    value={form.field}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        field: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Period
                  </label>

                  <input
                    placeholder="2023 — PRESENT"
                    value={form.period}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        period: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Status
                  </label>

                  <input
                    placeholder="Active Student"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Logo URL
                  </label>

                  <input
                    placeholder="https://..."
                    value={form.logo_url}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        logo_url: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Upload Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] ?? null)
                  }
                  className="block w-full rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/50 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
                />

                <p className="mt-2 text-[11px] text-white/25">
                  Upload logo akan menggantikan Logo URL.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                  />
                </div>

                <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_published: e.target.checked,
                      })
                    }
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
                  {saving
                    ? "ADDING..."
                    : "ADD EDUCATION →"}
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
          <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Existing Content
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              All Education
            </h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              Loading...
            </div>
          ) : education.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              No education found.
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                      {item.logo_url ? (
                        <img
                          src={item.logo_url}
                          alt={item.institution}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <span className="font-mono text-[9px] text-white/20">
                          NO LOGO
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[10px] text-white/25">
                          #{String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${
                            item.is_published
                              ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300/70"
                              : "border-white/10 bg-white/[0.03] text-white/30"
                          }`}
                        >
                          {item.is_published
                            ? "Published"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                        {item.institution}
                        {item.period && ` • ${item.period}`}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {item.degree}
                      </h3>

                      {item.field && (
                        <p className="mt-1 text-sm text-white/40">
                          {item.field}
                        </p>
                      )}

                      {item.status && (
                        <p className="mt-1 text-sm text-white/35">
                          {item.status}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/admin/education/${item.id}/edit`}
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          EDIT
                        </Link>

                        <button
                          onClick={() => togglePublish(item)}
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          {item.is_published
                            ? "UNPUBLISH"
                            : "PUBLISH"}
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
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