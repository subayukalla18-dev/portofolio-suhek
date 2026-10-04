import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // Cek user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Ambil jumlah data dari Supabase
  const [
    { count: projectsCount, error: projectsError },
    { count: certificatesCount, error: certificatesError },
    { count: educationCount, error: educationError },
    { count: experienceCount, error: experienceError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),

    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),

    supabase
      .from("education")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),

    supabase
      .from("experiences")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
  ]);

  // Debug kalau ada error
  if (projectsError) {
    console.error("FAILED TO COUNT PROJECTS:", projectsError);
  }

  if (certificatesError) {
    console.error("FAILED TO COUNT CERTIFICATES:", certificatesError);
  }

  if (educationError) {
    console.error("FAILED TO COUNT EDUCATION:", educationError);
  }

  if (experienceError) {
    console.error("FAILED TO COUNT EXPERIENCE:", experienceError);
  }

  const stats = [
    {
      label: "Projects",
      count: projectsCount ?? 0,
    },
    {
      label: "Certificates",
      count: certificatesCount ?? 0,
    },
    {
      label: "Education",
      count: educationCount ?? 0,
    },
    {
      label: "Experience",
      count: experienceCount ?? 0,
    },
  ];

  const managementItems = [
  {
    title: "Projects",
    description: "Manage projects portfolio content.",
    href: "/admin/projects",
  },
  {
    title: "Certificates",
    description: "Manage certificates portfolio content.",
    href: "/admin/certificates",
  },
  {
    title: "Education",
    description: "Manage education portfolio content.",
    href: "/admin/education",
  },
  {
    title: "Experience",
    description: "Manage experience portfolio content.",
    href: "/admin/experience",
  },
  {
    title: "Profile",
    description: "Manage your profile photo.",
    href: "/admin/profile",
  },
];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Admin Panel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-white/40">
              {user.email}
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              SIGN OUT
            </button>
          </form>
        </div>

        {/* STATISTICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.03]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENT MANAGEMENT */}
        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Content Management
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {managementItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.03]"
              >
                <h2 className="text-base font-semibold text-white">
                  {item.title}
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  {item.description}
                </p>

                <a
                  href={item.href}
                  className="mt-5 inline-flex rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  MANAGE →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}