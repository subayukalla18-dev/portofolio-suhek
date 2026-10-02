import Image from "next/image";
import Reveal from "@/components/Reveal";

const certificates = [
  {
    provider: "Digital Talent Scholarship",
    level: "2025",
    title: "Junior Web Developer",
    category: "Web Development",
    detail: "Vocational School Graduate Academy · 24 Jam Pelatihan",
    image: "/images/certificates/junior-web-developer.jpg",
  },
  {
    provider: "Digital Talent Scholarship",
    level: "2025",
    title:
      "Pengantar Mindset Digital 1 : Mengubah Masa Depan Anda Dengan Pola Pikir Digital",
    category: "Digital Skills",
    detail: "Micro Skill · 2 Jam Pelatihan",
    image: "/images/certificates/mindset-digital.jpg",
  },
];

export default function Certificates() {
  return (
    <section
      id="certificates"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* Header */}
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              Credentials
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
              Licenses & Certificates.
            </h2>
          </div>

          <p className="hidden font-mono text-[11px] uppercase text-white/45 md:block">
            2025
          </p>
        </div>
      </Reveal>

      {/* Certificates */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {certificates.map((certificate, index) => (
          <Reveal key={certificate.title} delay={index * 150}>
            <article className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/70 transition duration-500 hover:border-white/20">
              {/* Certificate Preview */}
              <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#050505]">
                <Image
                  src={certificate.image}
                  alt={certificate.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-transparent" />

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/60">
                    Certificate
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[11px] text-white/50">
                    {certificate.provider}
                    <span className="mx-2 text-white/20">•</span>
                    {certificate.level}
                  </p>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-7 text-white">
                  {certificate.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-white/45">
                  {certificate.detail}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                    {certificate.category}
                  </p>

                  <span className="font-mono text-[11px] text-white/40">
                    2025
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