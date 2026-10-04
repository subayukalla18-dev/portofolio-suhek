"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type Props = {
  experience: Experience;
};

export default function ExperienceForm({ experience }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    company: experience.company,
    position: experience.position,
    type: experience.type ?? "",
    period: experience.period ?? "",
    description: experience.description ?? "",
    logo_url: experience.logo_url ?? "",
    sort_order: experience.sort_order.toString(),
    is_published: experience.is_published,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
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

  async function uploadLogo(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `experience-${experience.id}-${Date.now()}.${extension}`;
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

    return {
      publicUrl: data.publicUrl,
      filePath,
    };
  }

  async function deleteOldLogo(imageUrl: string) {
    const marker =
      "/storage/v1/object/public/portfolio-logos/";

    if (!imageUrl.includes(marker)) {
      return;
    }

    const filePath = imageUrl.split(marker)[1];

    if (!filePath) {
      return;
    }

    const { error } = await supabase.storage
      .from("portfolio-logos")
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete old logo:", error);
    }
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
      let newLogoPath: string | null = null;

      if (logoFile) {
        const uploaded = await uploadLogo(logoFile);

        logoUrl = uploaded.publicUrl;
        newLogoPath = uploaded.filePath;
      }

      const { error } = await supabase
        .from("experiences")
        .update({
          company: form.company.trim(),
          position: form.position.trim(),
          type: form.type.trim() || null,
          period: form.period.trim() || null,
          description: form.description.trim() || null,
          logo_url: logoUrl || null,
          sort_order: Number(form.sort_order) || 0,
          is_published: form.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", experience.id);

      if (error) {
        console.error("=== EXPERIENCE UPDATE ERROR ===");
        console.error("message:", error.message);
        console.error("details:", error.details);
        console.error("hint:", error.hint);
        console.error("code:", error.code);

        if (newLogoPath) {
          await supabase.storage
            .from("portfolio-logos")
            .remove([newLogoPath]);
        }

        throw error;
      }

      if (
        logoFile &&
        experience.logo_url &&
        experience.logo_url !== logoUrl
      ) {
        await deleteOldLogo(experience.logo_url);
      }

      alert("Experience berhasil diperbarui.");

      router.push("/admin/experience");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui experience.");
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
              Company
            </label>

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
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
            rows={6}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-white/25"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/50">
            Logo URL
          </label>

          <input
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          />
        </div>

        {form.logo_url && (
          <div>
            <p className="mb-2 text-xs text-white/40">
              Current Logo
            </p>

            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
              <img
                src={form.logo_url}
                alt={form.company}
                className="h-full w-full object-contain p-3"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs text-white/50">
            Replace Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogoFile(e.target.files?.[0] ?? null)
            }
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
            onClick={() => router.push("/admin/experience")}
            className="rounded-full border border-white/10 px-5 py-2.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  );
}