import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
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
      description: "Published projects",
      icon: FolderKanban,
    },
    {
      label: "Certificates",
      count: certificatesCount ?? 0,
      description: "Published certificates",
      icon: Award,
    },
    {
      label: "Education",
      count: educationCount ?? 0,
      description: "Published education",
      icon: GraduationCap,
    },
    {
      label: "Experience",
      count: experienceCount ?? 0,
      description: "Published experience",
      icon: BriefcaseBusiness,
    },
  ];

  const managementItems = [
    {
      number: "01",
      title: "Projects",
      description: "Manage portfolio projects and applications.",
      count: projectsCount ?? 0,
      label: "published",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      number: "02",
      title: "Certificates",
      description: "Manage professional certificates and achievements.",
      count: certificatesCount ?? 0,
      label: "published",
      href: "/admin/certificates",
      icon: Award,
    },
    {
      number: "03",
      title: "Education",
      description: "Manage your academic background and education.",
      count: educationCount ?? 0,
      label: "published",
      href: "/admin/education",
      icon: GraduationCap,
    },
    {
      number: "04",
      title: "Experience",
      description: "Manage work experience and internships.",
      count: experienceCount ?? 0,
      label: "published",
      href: "/admin/experience",
      icon: BriefcaseBusiness,
    },
    {
      number: "05",
      title: "Profile",
      description: "Manage your portfolio profile photo.",
      count: null,
      label: "personal",
      href: "/admin/profile",
      icon: UserRound,
    },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin Panel
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Dashboard
              </h1>

              <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-sm text-white/50">
                  Manage your portfolio.
                </span>

                <span className="hidden text-white/15 sm:block">/</span>

                <span className="text-xs text-white/30">
                  {user.email}
                </span>
              </div>
            </div>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[11px] font-medium text-white/45 transition duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                SIGN OUT
              </button>
            </form>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              Overview
            </p>

            <p className="font-mono text-[10px] text-white/20">
              LIVE DATA
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-white/10 bg-white/[0.015] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/45 transition duration-300 group-hover:border-white/20 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="font-mono text-[10px] text-white/20">
                      {String(item.count).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {item.label}
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {String(item.count).padStart(2, "0")}
                  </p>

                  <p className="mt-2 text-[11px] text-white/25">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CONTENT MANAGEMENT */}
        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                Content Management
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-white">
                Manage portfolio
              </h2>
            </div>

            <p className="text-xs text-white/25">
              Select a section to continue.
            </p>
          </div>

          <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.01]">
            {managementItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col gap-5 p-5 transition duration-300 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                >
                  {/* NUMBER */}
                  <div className="flex shrink-0 items-center gap-4 sm:w-20">
                    <span className="font-mono text-[10px] text-white/20">
                      {item.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-white/40 transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.05] group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-white">
                        {item.title}
                      </h3>

                      {item.count !== null && (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
                          {item.count} {item.label}
                        </span>
                      )}

                      {item.count === null && (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
                          {item.label}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/30">
                      {item.description}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="flex shrink-0 items-center gap-2 text-white/25 transition duration-300 group-hover:text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
                      Manage
                    </span>

                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
            Subayu Kalla · Portfolio CMS
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/15">
            Secure Admin Area
          </p>
        </footer>
      </div>
    </main>
  );
}