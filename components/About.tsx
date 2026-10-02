import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* LEFT */}
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              About Me
            </p>

            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              Based in Lampung, ID
            </p>
          </div>
        </Reveal>

        {/* RIGHT */}
        <div>
          <Reveal delay={100}>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[34px]">
              Building practical digital solutions through software
              development and a clean, functional approach.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/50 sm:text-[15px]">
              I&apos;m an Informatics student at Universitas Teknokrat
              Indonesia with an interest in web development and digital
              systems. I enjoy turning ideas and requirements into
              functional applications that are clean, structured, and
              practical.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-[15px]">
              My experience covers web application development, IT support,
              networking, and system-related projects. I&apos;m continuously
              improving my technical skills while building solutions that
              focus on usability and real-world needs.
            </p>
          </Reveal>

          {/* CORE FOCUS */}
          <Reveal delay={400}>
            <div className="mt-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                Core Focus
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Full-Stack Development",
                  "Web Development",
                  "IT Support",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[11px] text-white/55 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}