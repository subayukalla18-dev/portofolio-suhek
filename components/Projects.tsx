import Image from "next/image";
import type { IconType } from "react-icons";
import Reveal from "@/components/Reveal";

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
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  tech: Tech[];
};

const projects: Project[] = [
  {
    number: "01",
    category: "WEB APPLICATION",
    title: "Internship Attendance System",
    description:
      "Web-based internship attendance system with GPS validation, WiFi verification, selfie attendance, and attendance monitoring for administrators.",
    image: "/images/projects/attendance-system.png",
    tech: [
      {
        name: "React",
        icon: SiReact,
        color: "#61DAFB",
      },
      {
        name: "NestJS",
        icon: SiNestjs,
        color: "#E0234E",
      },
      {
        name: "Prisma",
        icon: SiPrisma,
        color: "#FFFFFF",
      },
      {
        name: "PostgreSQL",
        icon: SiPostgresql,
        color: "#4169E1",
      },
    ],
  },
  {
    number: "02",
    category: "PERSONAL PORTFOLIO",
    title: "Subayu Kalla Portfolio",
    description:
      "Personal portfolio website showcasing projects, technical skills, education, experience, and professional certifications.",
    image: "/images/projects/portfolio.png",
    tech: [
      {
        name: "Next.js",
        icon: SiNextdotjs,
        color: "#FFFFFF",
      },
      {
        name: "TypeScript",
        icon: SiTypescript,
        color: "#3178C6",
      },
      {
        name: "Tailwind CSS",
        icon: SiTailwindcss,
        color: "#06B6D4",
      },
      {
        name: "Supabase",
        icon: SiSupabase,
        color: "#3ECF8E",
      },
    ],
  },
];

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

export default function Projects() {
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
            02 PROJECTS
          </p>
        </div>
      </Reveal>

      {/* Projects */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.number} delay={index * 150}>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/80 transition-all duration-500 hover:border-white/20">
              {/* Project Preview */}
              <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0b0b0b]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

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

                {/* Action */}
                <div className="mt-6">
                  <span className="inline-flex rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] text-white/45">
                    GitHub link coming soon
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}