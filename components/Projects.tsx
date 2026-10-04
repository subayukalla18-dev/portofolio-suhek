import Image from "next/image";
import type { IconType } from "react-icons";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

import {
  SiReact,
  SiNestjs,
  SiPrisma,
  SiPostgresql,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
} from "react-icons/si";

type Tech = {
  name: string;
  icon: IconType;
  color: string;
};

type Project = {
  id: number;
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  tech: Tech[];
  github: string;
};

const techConfig: Record<
  string,
  {
    icon: IconType;
    color: string;
  }
> = {
  React: {
    icon: SiReact,
    color: "#61DAFB",
  },
  NestJS: {
    icon: SiNestjs,
    color: "#E0234E",
  },
  Prisma: {
    icon: SiPrisma,
    color: "#FFFFFF",
  },
  PostgreSQL: {
    icon: SiPostgresql,
    color: "#4169E1",
  },
  "Next.js": {
    icon: SiNextdotjs,
    color: "#FFFFFF",
  },
  TypeScript: {
    icon: SiTypescript,
    color: "#3178C6",
  },
  "Tailwind CSS": {
    icon: SiTailwindcss,
    color: "#06B6D4",
  },
  Supabase: {
    icon: SiSupabase,
    color: "#3ECF8E",
  },
};

function TechBadge({ item }: { item: Tech }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
      <Icon
        className="h-3.5 w-3.5"
        style={{ color: item.color }}
      />

      <span className="text-[11px] text-white/55">
        {item.name}
      </span>
    </div>
  );
}

export default async function Projects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, category, description, image_url, github_url, tech_stack, sort_order",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
  console.error("FAILED TO FETCH PROJECTS");
  console.error("message:", error.message);
  console.error("details:", error.details);
  console.error("hint:", error.hint);
  console.error("code:", error.code);
}

  const projects: Project[] = (data ?? []).map((project, index) => {
    const techNames = Array.isArray(project.tech_stack)
      ? project.tech_stack
      : [];

    const tech: Tech[] = techNames
      .filter(
        (name): name is string =>
          typeof name === "string" && Boolean(techConfig[name]),
      )
      .map((name) => ({
        name,
        icon: techConfig[name].icon,
        color: techConfig[name].color,
      }));

    return {
      id: project.id,
      number: String(index + 1).padStart(2, "0"),
      category: project.category ?? "",
      title: project.title,
      description: project.description ?? "",
      image: project.image_url ?? "",
      github: project.github_url ?? "#",
      tech,
    };
  });

  return (
    <section
      id="work"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* Header */}
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              Selected Work
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
              Projects & Applications.
            </h2>
          </div>

          <p className="hidden font-mono text-[11px] uppercase text-white/45 md:block">
            {String(projects.length).padStart(2, "0")} PROJECTS
          </p>
        </div>
      </Reveal>

      {/* Projects */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 150}>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/80 transition-all duration-500 hover:border-white/20">
              {/* Project Preview */}
              <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0b0b0b]">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}

                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/60">
                    {project.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                  {project.category}
                </p>

                <h3 className="mt-2.5 text-lg font-semibold tracking-[-0.02em] text-white">
                  {project.title}
                </h3>

                <p className="mt-3 max-w-xl text-[13px] leading-6 text-white/45">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.map((item) => (
                    <TechBadge
                      key={item.name}
                      item={item}
                    />
                  ))}
                </div>

                {/* GitHub */}
                {project.github !== "#" && (
                  <div className="mt-6">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/github inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/50 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
                    >
                      <span>VIEW ON GITHUB</span>

                      <span className="transition-transform duration-300 group-hover/github:translate-x-0.5 group-hover/github:-translate-y-0.5">
                        ↗︎
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}