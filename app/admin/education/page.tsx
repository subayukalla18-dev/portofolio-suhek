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
  const [saving, setSaving] = useState(false);

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

      await loadEducation();
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
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 transition hover:text-white"
        >
          ← BACK TO DASHBOARD
        </Link>

        <div className="mt-10 flex items-end justify-between gap-6 border-b border-white/10 pb-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Content Management
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
              Education
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Manage your education history.
            </p>
          </div>

          <div className="rounded-full border border-white/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
            {education.length} ITEMS
          </div>
        </div>

        {/* CREATE */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-[#080808]/70 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
            Create
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Add Education
          </h2>

          <form
            onSubmit={handleCreate}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            <input
              placeholder="Institution"
              value={form.institution}
              onChange={(e) =>
                setForm({
                  ...form,
                  institution: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <input
              placeholder="Degree"
              value={form.degree}
              onChange={(e) =>
                setForm({
                  ...form,
                  degree: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <input
              placeholder="Field"
              value={form.field}
              onChange={(e) =>
                setForm({
                  ...form,
                  field: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <input
              placeholder="Period"
              value={form.period}
              onChange={(e) =>
                setForm({
                  ...form,
                  period: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <input
              placeholder="Status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <input
              placeholder="Logo URL"
              value={form.logo_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  logo_url: e.target.value,
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <div className="md:col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border border-white/10 bg-black p-3 text-sm text-white/50"
              />

              <p className="mt-2 text-[11px] text-white/25">
                Upload logo akan menggantikan Logo URL.
              </p>
            </div>

            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({
                  ...form,
                  sort_order: Number(e.target.value),
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white/50">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_published: e.target.checked,
                  })
                }
              />
              Publish immediately
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {saving
                  ? "ADDING..."
                  : "ADD EDUCATION →"}
              </button>
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Existing Content
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              All Education
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-white/35">
              Loading...
            </p>
          ) : education.length === 0 ? (
            <div className="rounded-3xl border border-white/10 p-8 text-sm text-white/35">
              No education found.
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-[#080808]/70 p-6 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div className="flex gap-5">

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {item.logo_url ? (
                          <img
                            src={item.logo_url}
                            alt={item.institution}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-[10px] text-white/20">
                            NO LOGO
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[10px] text-white/25">
                            #{String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-wider ${
                              item.is_published
                                ? "border-emerald-500/30 text-emerald-400"
                                : "border-white/10 text-white/30"
                            }`}
                          >
                            {item.is_published
                              ? "PUBLISHED"
                              : "HIDDEN"}
                          </span>
                        </div>

                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                          {item.institution}
                          {item.period && ` · ${item.period}`}
                        </p>

                        <h3 className="mt-3 text-xl font-semibold text-white">
                          {item.degree}
                        </h3>

                        {item.field && (
                          <p className="mt-2 text-sm text-white/45">
                            {item.field}
                          </p>
                        )}

                        {item.status && (
                          <p className="mt-2 text-sm text-white/35">
                            {item.status}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/education/${item.id}/edit`}
                        className="rounded-full border border-white/10 px-4 py-2 text-[11px] text-white/50 transition hover:border-white/20 hover:text-white"
                      >
                        EDIT
                      </Link>

                      <button
                        onClick={() =>
                          togglePublish(item)
                        }
                        className="rounded-full border border-white/10 px-4 py-2 text-[11px] text-white/50 transition hover:border-white/20 hover:text-white"
                      >
                        {item.is_published
                          ? "UNPUBLISH"
                          : "PUBLISH"}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item)
                        }
                        className="rounded-full border border-red-500/10 px-4 py-2 text-[11px] text-red-400/60 transition hover:border-red-500/30 hover:text-red-400"
                      >
                        DELETE
                      </button>
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