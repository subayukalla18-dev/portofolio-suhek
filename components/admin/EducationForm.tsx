"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Education = {
  id?: number;
  institution: string;
  degree: string;
  field: string;
  period: string;
  status: string;
  logo_url: string;
  sort_order: number;
  is_published: boolean;
};

type Props = {
  initialData?: Education;
};

const emptyData: Education = {
  institution: "",
  degree: "",
  field: "",
  period: "",
  status: "",
  logo_url: "",
  sort_order: 0,
  is_published: true,
};

export default function EducationForm({ initialData }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<Education>(
    initialData ?? emptyData,
  );

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof Education>(
    key: K,
    value: Education[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
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

      // Upload logo jika ada file baru
      if (file) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "png";

        const fileName = `education-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-logos")
          .upload(fileName, file, {
            upsert: false,
          });

        if (uploadError) {
          console.error("UPLOAD EDUCATION LOGO ERROR:", uploadError);
          alert("Gagal upload logo.");
          return;
        }

        const { data } = supabase.storage
          .from("portfolio-logos")
          .getPublicUrl(fileName);

        logoUrl = data.publicUrl;
      }

      const payload = {
        institution: form.institution.trim(),
        degree: form.degree.trim(),
        field: form.field.trim(),
        period: form.period.trim(),
        status: form.status.trim(),
        logo_url: logoUrl.trim(),
        sort_order: Number(form.sort_order),
        is_published: form.is_published,
      };

      let error;

      if (initialData?.id) {
        const result = await supabase
          .from("education")
          .update(payload)
          .eq("id", initialData.id);

        error = result.error;
      } else {
        const result = await supabase
          .from("education")
          .insert(payload);

        error = result.error;
      }

      if (error) {
        console.error("=== EDUCATION SAVE ERROR ===");
        console.error("message:", error.message);
        console.error("details:", error.details);
        console.error("hint:", error.hint);
        console.error("code:", error.code);

        alert(
          `Gagal menyimpan education.\n\n${error.message}`,
        );

        return;
      }

      router.push("/admin/education");
      router.refresh();
    } catch (error) {
      console.error("EDUCATION FORM ERROR:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-[#080808]/70 p-6 sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">

        {/* Institution */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Institution
          </label>

          <input
            type="text"
            value={form.institution}
            onChange={(e) =>
              updateField("institution", e.target.value)
            }
            placeholder="Universitas Teknokrat Indonesia"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Degree */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Degree
          </label>

          <input
            type="text"
            value={form.degree}
            onChange={(e) =>
              updateField("degree", e.target.value)
            }
            placeholder="Bachelor of Informatics"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Field */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Field
          </label>

          <input
            type="text"
            value={form.field}
            onChange={(e) =>
              updateField("field", e.target.value)
            }
            placeholder="Informatics"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Period */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Period
          </label>

          <input
            type="text"
            value={form.period}
            onChange={(e) =>
              updateField("period", e.target.value)
            }
            placeholder="2023 — Present"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Status
          </label>

          <input
            type="text"
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value)
            }
            placeholder="Currently Studying"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Logo URL
          </label>

          <input
            type="url"
            value={form.logo_url}
            onChange={(e) =>
              updateField("logo_url", e.target.value)
            }
            placeholder="https://..."
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
          />
        </div>

        {/* Upload */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs text-white/45">
            Upload Logo
          </label>

          <div className="rounded-2xl border border-white/10 bg-black p-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              className="block w-full text-sm text-white/50 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
            />
          </div>

          <p className="mt-2 text-[11px] text-white/25">
            Jika upload logo digunakan, Logo URL akan digantikan.
          </p>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-2 block text-xs text-white/45">
            Sort Order
          </label>

          <input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              updateField(
                "sort_order",
                Number(e.target.value),
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/25"
          />
        </div>

        {/* Publish */}
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              updateField(
                "is_published",
                e.target.checked,
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-white/55">
            {initialData
              ? "Published"
              : "Publish immediately"}
          </span>
        </label>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "SAVING..."
            : initialData
              ? "SAVE CHANGES →"
              : "ADD EDUCATION →"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/education")}
          className="rounded-full border border-white/10 px-6 py-3 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}