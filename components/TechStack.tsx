import type { IconType } from "react-icons";
import Reveal from "@/components/Reveal";

import {
  SiReact,
  SiNextdotjs,
  SiNestjs,
  SiNodedotjs,
  SiPrisma,
  SiPostgresql,
  SiSupabase,
  SiMysql,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiFigma,
  SiPostman,
  SiSwagger,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";

import { Network, Camera, Server, Activity } from "lucide-react";

type Tech = {
  name: string;
  icon: IconType;
  color: string;
};

const techGroups = [
  {
    title: "Full-Stack & Backend",
    description:
      "Building modern web applications and scalable backend systems.",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Prisma", icon: SiPrisma, color: "#FFFFFF" },
      { name: "REST API", icon: Server, color: "#A3A3A3" },
    ] satisfies Tech[],
  },
  {
    title: "Database & Cloud",
    description:
      "Working with relational databases and modern backend platforms.",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    ] satisfies Tech[],
  },
  {
    title: "Frontend & UI Development",
    description:
      "Creating responsive, accessible, and functional user interfaces.",
    items: [
      { name: "HTML", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ] satisfies Tech[],
  },
  {
    title: "IT Support & Networking",
    description:
      "Supporting infrastructure, connectivity, monitoring, and physical systems.",
    items: [
      { name: "IT Support", icon: Server, color: "#A3A3A3" },
      { name: "Network Support", icon: Network, color: "#60A5FA" },
      { name: "CCTV", icon: Camera, color: "#A3A3A3" },
      { name: "System Monitoring", icon: Activity, color: "#34D399" },
    ] satisfies Tech[],
  },
  {
    title: "Tools & Development Workflow",
    description:
      "Tools used for development, API testing, design, and collaboration.",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "VS Code", icon: VscVscode, color: "#007ACC" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Swagger", icon: SiSwagger, color: "#85EA2D" },
    ] satisfies Tech[],
  },
];

function TechItem({ item }: { item: Tech }) {
  const Icon = item.icon;

  return (
    <div className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
      <Icon
        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ color: item.color }}
      />

      <span className="text-xs text-white/65 transition-colors duration-300 group-hover:text-white">
        {item.name}
      </span>
    </div>
  );
}

export default function TechStack() {
  return (
    <section
      id="stack"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* Header */}
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              Expertise & Capabilities
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
              Technical Stack & Specializations.
            </h2>
          </div>

          <p className="hidden font-mono text-[11px] uppercase text-white/45 md:block">
            2023 — PRESENT
          </p>
        </div>
      </Reveal>

      {/* Cards */}
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {techGroups.map((group, index) => (
          <Reveal key={group.title} delay={index * 100}>
            <article className="h-full rounded-2xl border border-white/10 bg-[#080808]/70 p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#0a0a0a]">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                  0{index + 1}
                </p>

                <h3 className="mt-3 text-base font-semibold leading-6 text-white">
                  {group.title}
                </h3>
              </div>

              <p className="mt-3 text-[13px] leading-6 text-white/40">
                {group.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <TechItem key={item.name} item={item} />
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}