import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CertificateForm from "@/components/admin/CertificateForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCertificatePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !certificate) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <a
            href="/admin/certificates"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 transition hover:text-white"
          >
            ← Back to Certificates
          </a>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Content Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            Edit Certificate
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Update certificate information.
          </p>
        </div>

        <CertificateForm certificate={certificate} />
      </div>
    </main>
  );
}