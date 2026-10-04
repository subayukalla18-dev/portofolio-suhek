import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EducationForm from "@/components/admin/EducationForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEducationPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("education")
    .select(
      "id, institution, degree, field, period, status, logo_url, sort_order, is_published",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <a
          href="/admin/education"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 transition hover:text-white"
        >
          ← BACK TO EDUCATION
        </a>

        <div className="mt-10 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
            Education
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-white">
            Edit Education
          </h1>
        </div>

        <EducationForm
          initialData={{
            id: data.id,
            institution: data.institution,
            degree: data.degree,
            field: data.field ?? "",
            period: data.period ?? "",
            status: data.status ?? "",
            logo_url: data.logo_url ?? "",
            sort_order: data.sort_order ?? 0,
            is_published: data.is_published,
          }}
        />
      </div>
    </main>
  );
}