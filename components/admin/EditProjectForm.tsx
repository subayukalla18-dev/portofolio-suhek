"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  sort_order: number | null;
  is_published: boolean;
};

type EditProjectFormProps = {
  project: Project;
};

export default function EditProjectForm({
  project,
}: EditProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category ?? "");
  const [description, setDescription] = useState(
    project.description ?? "",
  );
  const [githubUrl, setGithubUrl] = useState(
    project.github_url ?? "",
  );
  const [techStack, setTechStack] = useState(
    Array.isArray(project.tech_stack)
      ? project.tech_stack.join(", ")
      : "",
  );
  const [sortOrder, setSortOrder] = useState(
    String(project.sort_order ?? 0),
  );
  const [isPublished, setIsPublished] = useState(
    project.is_published,
  );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState(
    project.image_url ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = project.image_url;

      /*
       * Jika user memilih gambar baru,
       * upload gambar baru ke Supabase Storage.
       */
      if (selectedFile) {
        const fileExtension =
          selectedFile.name.split(".").pop() ?? "jpg";

        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-projects")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: selectedFile.type,
          });

        if (uploadError) {
          throw new Error(
            `Gagal upload gambar: ${uploadError.message}`,
          );
        }

        const { data: publicUrlData } =
          supabase.storage
            .from("portfolio-projects")
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      /*
       * Ubah tech stack dari:
       *
       * Next.js, Supabase
       *
       * menjadi:
       *
       * ["Next.js", "Supabase"]
       */
      const parsedTechStack = techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      /*
       * Update project di database.
       */
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          title: title.trim(),
          category: category.trim() || null,
          description: description.trim() || null,
          image_url: imageUrl,
          github_url: githubUrl.trim() || null,
          tech_stack: parsedTechStack,
          sort_order: Number(sortOrder) || 0,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (updateError) {
        throw new Error(
          `Gagal update project: ${updateError.message}`,
        );
      }

      setSuccess("Project berhasil diperbarui.");

      /*
       * Tunggu sebentar supaya pesan sukses terlihat,
       * lalu kembali ke daftar project.
       */
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-white/10 bg-[#080808]/70 p-5 sm:p-7"
    >
      {/* TITLE + CATEGORY */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label
          htmlFor="description"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-white/25"
        />
      </div>

      {/* CURRENT IMAGE / NEW IMAGE */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Project Image
        </label>

        {previewUrl && (
          <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
            <Image
              src={previewUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
          <input
            id="project-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-white/50 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-medium file:text-black hover:file:bg-white/90"
          />

          <p className="mt-3 text-[11px] text-white/30">
            Pilih gambar baru jika ingin mengganti gambar.
            Maksimal 5 MB.
          </p>

          {selectedFile && (
            <p className="mt-2 text-xs text-white/50">
              File baru: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      {/* GITHUB + TECH STACK */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="github"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
          >
            GitHub URL
          </label>

          <input
            id="github"
            type="url"
            value={githubUrl}
            onChange={(event) =>
              setGithubUrl(event.target.value)
            }
            placeholder="https://github.com/..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />
        </div>

        <div>
          <label
            htmlFor="tech-stack"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
          >
            Tech Stack
          </label>

          <input
            id="tech-stack"
            type="text"
            value={techStack}
            onChange={(event) =>
              setTechStack(event.target.value)
            }
            placeholder="Next.js, Supabase"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />

          <p className="mt-2 text-[11px] text-white/30">
            Pisahkan dengan koma.
          </p>
        </div>
      </div>

      {/* SORT ORDER + PUBLISH */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="sort-order"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
          >
            Sort Order
          </label>

          <input
            id="sort-order"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Visibility
          </p>

          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) =>
                setIsPublished(event.target.checked)
              }
              className="h-4 w-4 accent-white"
            />

            <span className="text-sm text-white/60">
              Published
            </span>
          </label>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
          <p className="text-sm text-green-400">
            {success}
          </p>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={loading}
          className="rounded-full border border-white/10 px-5 py-2.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          CANCEL
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </form>
  );
}