import Image from "next/image";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

type Education = {
  id: number;
  institution: string;
  degree: string | null;
  field: string | null;
  period: string | null;
  status: string | null;
  logo_url: string | null;
};

type ExperienceItem = {
  id: number;
  company: string;
  position: string;
  type: string | null;
  period: string | null;
  description: string | null;
  logo_url: string | null;
};

function LogoBox({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  return (
    <div className="group/logo flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={44}
          height={44}
          className="h-10 w-10 object-contain transition-all duration-300 group-hover/logo:scale-105"
        />
      ) : (
        <div className="font-mono text-[9px] text-white/20">
          —
        </div>
      )}
    </div>
  );
}

export default async function Experience() {
  const supabase = await createClient();

  const [
    { data: educationData, error: educationError },
    { data: experienceData, error: experienceError },
  ] = await Promise.all([
    supabase
      .from("education")
      .select(
        "id, institution, degree, field, period, status, logo_url, sort_order",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),

    supabase
      .from("experiences")
      .select(
        "id, company, position, type, period, description, logo_url, sort_order",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (educationError) {
    console.error("FAILED TO FETCH EDUCATION");
    console.error("message:", educationError.message);
    console.error("details:", educationError.details);
    console.error("hint:", educationError.hint);
    console.error("code:", educationError.code);
  }

  if (experienceError) {
    console.error("FAILED TO FETCH EXPERIENCES");
    console.error("message:", experienceError.message);
    console.error("details:", experienceError.details);
    console.error("hint:", experienceError.hint);
    console.error("code:", experienceError.code);
  }

  const education: Education[] = educationData ?? [];
  const experiences: ExperienceItem[] = experienceData ?? [];

  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* HEADER */}
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              Background
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
              Education & Experience.
            </h2>
          </div>

          <p className="hidden font-mono text-[11px] uppercase text-white/45 md:block">
            2021 — PRESENT
          </p>
        </div>
      </Reveal>

      {/* CONTENT */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* EDUCATION */}
        <Reveal delay={150}>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">
                Education
              </h3>

              <span className="font-mono text-[9px] text-white/30">
                {String(education.length).padStart(2, "0")} ITEMS
              </span>
            </div>

            <div className="space-y-3">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-[#080808]/70 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="flex gap-4">
                    <LogoBox
                      src={item.logo_url}
                      alt={item.institution}
                    />

                    <div className="min-w-0 flex-1">
                      {item.period && (
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                          {item.period}
                        </p>
                      )}

                      <h4 className="mt-2 text-[15px] font-semibold text-white">
                        {item.institution}
                      </h4>

                      {(item.degree || item.field) && (
                        <p className="mt-1 text-[13px] text-white/50">
                          {item.degree}
                          {item.degree && item.field ? " — " : ""}
                          {item.field}
                        </p>
                      )}

                      {item.status && (
                        <div className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1">
                          <span className="text-[11px] text-white/55">
                            {item.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        {/* EXPERIENCE */}
        <Reveal delay={300}>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">
                Experience
              </h3>

              <span className="font-mono text-[9px] text-white/30">
                {String(experiences.length).padStart(2, "0")} ITEMS
              </span>
            </div>

            <div className="space-y-3">
              {experiences.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-[#080808]/70 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="flex gap-4">
                    <LogoBox
                      src={item.logo_url}
                      alt={item.company}
                    />

                    <div className="min-w-0 flex-1">
                      {item.period && (
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                          {item.period}
                        </p>
                      )}

                      <h4 className="mt-2 text-[15px] font-semibold text-white">
                        {item.company}
                      </h4>

                      <p className="mt-1 text-[13px] text-white/50">
                        {item.position}
                      </p>

                      {item.description && (
                        <p className="mt-3 text-[13px] leading-6 text-white/40">
                          {item.description}
                        </p>
                      )}

                      {item.type && (
                        <div className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1">
                          <span className="text-[11px] text-white/55">
                            {item.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}