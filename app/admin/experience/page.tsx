"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Experience = {
  id: number;
  company: string;
  position: string;
  type: string | null;
  period: string | null;
  description: string | null;
  logo_url: string | null;
  sort_order: number;
  is_published: boolean;
};

const supabase = createClient();

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    company: "",
    position: "",
    type: "",
    period: "",
    description: "",
    logo_url: "",
    sort_order: "0",
    is_published: true,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  async function fetchExperiences() {
    setLoading(true);

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("FETCH EXPERIENCE ERROR:", error);
      alert("Gagal mengambil data experience.");
    } else {
      setExperiences(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchExperiences();
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

  async function uploadLogo(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `experience-${Date.now()}.${extension}`;
    const filePath = `experiences/${fileName}`;

    const { error } = await supabase.storage
      .from("portfolio-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("portfolio-logos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.company.trim() || !form.position.trim()) {
      alert("Company dan position wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      let logoUrl = form.logo_url.trim();

      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const { error } = await supabase.from("experiences").insert({
        company: form.company.trim(),
        position: form.position.trim(),
        type: form.type.trim() || null,
        period: form.period.trim() || null,
        description: form.description.trim() || null,
        logo_url: logoUrl || null,
        sort_order: Number(form.sort_order) || 0,
        is_published: form.is_published,
      });

      if (error) {
        console.error("CREATE EXPERIENCE ERROR:", error);
        throw error;
      }

      setForm({
        company: "",
        position: "",
        type: "",
        period: "",
        description: "",
        logo_url: "",
        sort_order: "0",
        is_published: true,
      });

      setLogoFile(null);

      const fileInput = document.getElementById(
        "experience-logo",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchExperiences();

      setShowAddForm(false);

      alert("Experience berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan experience.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(
    id: number,
    currentStatus: boolean,
  ) {
    const { error } = await supabase
      .from("experiences")
      .update({
        is_published: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("TOGGLE EXPERIENCE ERROR:", error);
      alert("Gagal mengubah status.");
      return;
    }

    await fetchExperiences();
  }

  async function deleteExperience(experience: Experience) {
    const confirmed = confirm(
      `Yakin ingin menghapus experience "${experience.position} - ${experience.company}"?`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", experience.id);

    if (error) {
      console.error("DELETE EXPERIENCE ERROR:", error);
      alert("Gagal menghapus experience.");
      return;
    }

    if (experience.logo_url) {
      try {
        const marker =
          "/storage/v1/object/public/portfolio-logos/";

        if (experience.logo_url.includes(marker)) {
          const filePath = experience.logo_url.split(marker)[1];

          if (filePath) {
            await supabase.storage
              .from("portfolio-logos")
              .remove([filePath]);
          }
        }
      } catch (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    await fetchExperiences();
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
              Experience
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage your professional experience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                {experiences.length} Experiences
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90"
            >
              {showAddForm ? "CLOSE ×" : "+ ADD EXPERIENCE"}
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
                Add Experience
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Company
                  </label>

                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="PLN Icon Plus"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Position
                  </label>

                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="IT Support Intern"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Type
                  </label>

                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Internship"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Period
                  </label>

                  <input
                    name="period"
                    value={form.period}
                    onChange={handleChange}
                    placeholder="MAR 2 — JUL 1, 2026"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your responsibilities and experience..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Logo URL
                  </label>

                  <input
                    name="logo_url"
                    value={form.logo_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Upload Logo
                  </label>

                  <input
                    id="experience-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setLogoFile(e.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/50 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
                  />
                </div>
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
                  {saving ? "SAVING..." : "ADD EXPERIENCE →"}
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
              All Experiences
            </h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#080808]/70 p-8 text-center text-sm text-white/30">
              Belum ada experience.
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience, index) => (
                <article
                  key={experience.id}
                  className="rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                      {experience.logo_url ? (
                        <img
                          src={experience.logo_url}
                          alt={experience.company}
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
                            experience.is_published
                              ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300/70"
                              : "border-white/10 bg-white/[0.03] text-white/30"
                          }`}
                        >
                          {experience.is_published
                            ? "Published"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                        {experience.company}
                        {experience.period && ` • ${experience.period}`}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {experience.position}
                      </h3>

                      {experience.type && (
                        <p className="mt-1 text-sm text-white/40">
                          {experience.type}
                        </p>
                      )}

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/35">
                        {experience.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={`/admin/experience/${experience.id}/edit`}
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          EDIT
                        </a>

                        <button
                          onClick={() =>
                            togglePublished(
                              experience.id,
                              experience.is_published,
                            )
                          }
                          className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        >
                          {experience.is_published
                            ? "UNPUBLISH"
                            : "PUBLISH"}
                        </button>

                        <button
                          onClick={() =>
                            deleteExperience(experience)
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