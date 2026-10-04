import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditProjectForm from "@/components/admin/EditProjectForm";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, title, category, description, image_url, github_url, tech_stack, sort_order, is_published",
    )
    .eq("id", projectId)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/projects"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 transition hover:text-white"
        >
          ← Back to Projects
        </Link>

        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Content Management
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            Edit Project
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Update your portfolio project.
          </p>
        </div>

        <div className="mt-8">
          <EditProjectForm project={project} />
        </div>
      </div>
    </main>
  );
}