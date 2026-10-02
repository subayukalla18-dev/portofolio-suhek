import Image from "next/image";
import Reveal from "@/components/Reveal";

const education = [
  {
    period: "2023 — PRESENT",
    title: "Universitas Teknokrat Indonesia",
    subtitle: "S1 — Informatika",
    status: "Semester 7",
    logo: "/images/logos/universitas-teknokrat.jpg",
    alt: "Logo Universitas Teknokrat Indonesia",
  },
  {
    period: "2021 — 2023",
    title: "SMA Negeri 1 Menggala",
    subtitle: "Jurusan IPA",
    status: "",
    logo: "/images/logos/sman-1-menggala.jpg",
    alt: "Logo SMA Negeri 1 Menggala",
  },
];

const experience = [
  {
    period: "MAR 2 — JUL 1, 2026",
    title: "PLN Icon Plus",
    subtitle: "ICONNET — Internship",
    description:
      "IT support, network support, CCTV systems, FTTH, and monitoring system operations.",
    type: "Internship",
    logo: "/images/logos/pln-icon-plus.jpg",
    alt: "Logo PLN Icon Plus",
  },
];

function LogoBox({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="group/logo flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      <Image
        src={src}
        alt={alt}
        width={44}
        height={44}
        className="h-10 w-10 object-contain transition-all duration-300 group-hover/logo:scale-105"
      />
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* Header */}
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

      {/* Content */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Education */}
        <Reveal delay={150}>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">
                Education
              </h3>

              <span className="font-mono text-[9px] text-white/30">
                02 ITEMS
              </span>
            </div>

            <div className="space-y-3">
              {education.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-[#080808]/70 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="flex gap-4">
                    <LogoBox src={item.logo} alt={item.alt} />

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                        {item.period}
                      </p>

                      <h4 className="mt-2 text-[15px] font-semibold text-white">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-[13px] text-white/50">
                        {item.subtitle}
                      </p>

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

        {/* Experience */}
        <Reveal delay={300}>
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">
                Experience
              </h3>

              <span className="font-mono text-[9px] text-white/30">
                01 ITEM
              </span>
            </div>

            <div className="space-y-3">
              {experience.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-[#080808]/70 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="flex gap-4">
                    <LogoBox src={item.logo} alt={item.alt} />

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                        {item.period}
                      </p>

                      <h4 className="mt-2 text-[15px] font-semibold text-white">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-[13px] text-white/50">
                        {item.subtitle}
                      </p>

                      <p className="mt-3 text-[13px] leading-6 text-white/40">
                        {item.description}
                      </p>

                      <div className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1">
                        <span className="text-[11px] text-white/55">
                          {item.type}
                        </span>
                      </div>
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