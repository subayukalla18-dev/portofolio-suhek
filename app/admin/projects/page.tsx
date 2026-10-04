"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  sort_order: number;
  is_published: boolean;
};

const emptyForm = {
  title: "",
  category: "",
  description: "",
  image_url: "",
  github_url: "",
  tech_stack: "",
  sort_order: "0",
  is_published: true,
};

const BUCKET_NAME = "portfolio-projects";

export default function AdminProjectsPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function fetchProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("FAILED TO FETCH PROJECTS:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setProjects((data ?? []) as Project[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setPreviewImage(null);
    setIsFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title ?? "",
      category: project.category ?? "",
      description: project.description ?? "",
      image_url: project.image_url ?? "",
      github_url: project.github_url ?? "",
      tech_stack: Array.isArray(project.tech_stack)
        ? project.tech_stack.join(", ")
        : "",
      sort_order: String(project.sort_order ?? 0),
      is_published: project.is_published,
    });

    setSelectedImage(null);
    setPreviewImage(project.image_url ?? null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setPreviewImage(null);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  }

  async function uploadImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `projects/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }

  function getStoragePathFromUrl(url: string | null) {
    if (!url) {
      return null;
    }

    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.substring(index + marker.length),
    );
  }

  async function deleteStorageFile(url: string | null) {
    const path = getStoragePathFromUrl(url);

    if (!path) {
      return;
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("FAILED TO DELETE STORAGE FILE:", error);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Judul project wajib diisi.");
      return;
    }

    setSaving(true);

    let uploadedImagePath: string | null = null;
    let imageUrl = form.image_url.trim() || null;

    try {
      /*
       * UPLOAD GAMBAR BARU
       */
      if (selectedImage) {
        const uploaded = await uploadImage(selectedImage);

        imageUrl = uploaded.url;
        uploadedImagePath = uploaded.path;
      }

      const techStack = form.tech_stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || null,
        description: form.description.trim() || null,
        image_url: imageUrl,
        github_url: form.github_url.trim() || null,
        tech_stack: techStack,
        sort_order: Number(form.sort_order) || 0,
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      };

      /*
       * UPDATE
       */
      if (editingId) {
        const oldProject = projects.find(
          (project) => project.id === editingId,
        );

        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);

        if (error) {
          /*
           * Kalau database gagal,
           * hapus gambar baru supaya tidak jadi file sampah.
           */
          if (uploadedImagePath) {
            await supabase.storage
              .from(BUCKET_NAME)
              .remove([uploadedImagePath]);
          }

          throw error;
        }

        /*
         * Kalau gambar diganti,
         * hapus gambar lama dari Storage.
         */
        if (
          selectedImage &&
          oldProject?.image_url &&
          oldProject.image_url !== imageUrl
        ) {
          await deleteStorageFile(oldProject.image_url);
        }
      }

      /*
       * CREATE
       */
      else {
        const { error } = await supabase
          .from("projects")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (error) {
          /*
           * Kalau insert gagal,
           * hapus gambar yang baru saja diupload.
           */
          if (uploadedImagePath) {
            await supabase.storage
              .from(BUCKET_NAME)
              .remove([uploadedImagePath]);
          }

          throw error;
        }
      }

      await fetchProjects();

      closeForm();
    } catch (error) {
      console.error("FAILED TO SAVE PROJECT:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal menyimpan project.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: number,
    title: string,
    imageUrl: string | null,
  ) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus project "${title}"?`,
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("FAILED TO DELETE PROJECT:", error);
      alert(error.message);
      return;
    }

    /*
     * Hapus gambar dari Storage kalau gambar
     * berasal dari bucket portfolio-projects.
     */
    await deleteStorageFile(imageUrl);

    await fetchProjects();
  }

  async function togglePublished(project: Project) {
    const { error } = await supabase
      .from("projects")
      .update({
        is_published: !project.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (error) {
      console.error(
        "FAILED TO UPDATE PROJECT STATUS:",
        error,
      );

      alert(error.message);
      return;
    }

    await fetchProjects();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a
              href="/admin"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 transition hover:text-white"
            >
              ← Back to Dashboard
            </a>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Content Management
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
              Projects
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage your portfolio projects.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90"
          >
            + ADD PROJECT
          </button>
        </div>

        {/* FORM */}
        {isFormOpen && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#080808]/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                  {editingId ? "Edit Project" : "New Project"}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {editingId
                    ? "Update project"
                    : "Add a new project"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
              >
                CLOSE
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              {/* TITLE */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="Internship Attendance System"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                  required
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Category
                </label>

                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  placeholder="WEB APPLICATION"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe your project..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Project Image
                </label>

                <div className="mt-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                  {previewImage && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black">
                      <img
                        src={previewImage}
                        alt="Project preview"
                        className="max-h-[320px] w-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-white/40 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-medium file:text-black hover:file:bg-white/90"
                  />

                  <p className="mt-3 text-[11px] text-white/25">
                    Format gambar bebas. Maksimal 5 MB.
                  </p>
                </div>
              </div>

              {/* GITHUB */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  GitHub URL
                </label>

                <input
                  type="url"
                  value={form.github_url}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      github_url: event.target.value,
                    })
                  }
                  placeholder="https://github.com/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              {/* TECH STACK */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Tech Stack
                </label>

                <input
                  type="text"
                  value={form.tech_stack}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      tech_stack: event.target.value,
                    })
                  }
                  placeholder="React, NestJS, Prisma, PostgreSQL"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />

                <p className="mt-2 text-[11px] text-white/25">
                  Pisahkan dengan koma.
                </p>
              </div>

              {/* SORT ORDER */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Sort Order
                </label>

                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sort_order: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                />
              </div>

              {/* PUBLISHED */}
              <div className="flex items-center md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        is_published: event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-white"
                  />

                  <span className="text-sm text-white/60">
                    Publish project ke portfolio
                  </span>
                </label>
              </div>

              {/* BUTTON */}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "SAVING..."
                    : editingId
                      ? "UPDATE PROJECT"
                      : "CREATE PROJECT"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROJECT LIST */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              All Projects
            </p>

            <p className="font-mono text-[10px] text-white/30">
              {projects.length} ITEMS
            </p>
          </div>

          {loading ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#080808]/70 p-6">
              <p className="text-sm text-white/40">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-[#080808]/50 p-10 text-center">
              <p className="text-sm text-white/40">
                Belum ada project.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-medium text-black"
              >
                + ADD PROJECT
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-white/25">
                          #{project.sort_order}
                        </span>

                        {project.category && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">
                            {project.category}
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] ${
                            project.is_published
                              ? "border-white/10 text-white/60"
                              : "border-white/5 text-white/25"
                          }`}
                        >
                          {project.is_published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <h2 className="mt-2 text-lg font-semibold text-white">
                        {project.title}
                      </h2>

                      {project.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                          {project.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(project.tech_stack ?? []).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          togglePublished(project)
                        }
                        className="rounded-full border border-white/10 px-3.5 py-2 text-[11px] text-white/50 transition hover:border-white/20 hover:text-white"
                      >
                        {project.is_published
                          ? "UNPUBLISH"
                          : "PUBLISH"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(project)
                        }
                        className="rounded-full border border-white/10 px-3.5 py-2 text-[11px] text-white/50 transition hover:border-white/20 hover:text-white"
                      >
                        EDIT
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            project.id,
                            project.title,
                            project.image_url,
                          )
                        }
                        className="rounded-full border border-red-500/10 px-3.5 py-2 text-[11px] text-red-400/60 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}