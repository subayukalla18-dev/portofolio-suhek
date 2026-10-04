"use client";

import { useEffect, useState } from "react";

const baseProfileImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-profile/subayu.jpg`;

export default function Hero() {
  const [isActive, setIsActive] = useState(false);

  const [profileImage, setProfileImage] = useState(baseProfileImage);

  useEffect(() => {
    setProfileImage(`${baseProfileImage}?v=${Date.now()}`);
  }, []);

  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 pt-32 pb-20 md:px-8"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* LEFT */}
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
            Full Stack Developer
          </p>

          <h1 className="max-w-lg text-5xl font-semibold leading-[1] tracking-[-0.04em] text-white sm:text-[48px] lg:text-[52px]">
            Building digital
            <br />
            products &
            <br />
            experiences.
          </h1>

          <p className="mt-6 max-w-[520px] text-sm leading-7 text-white/55 sm:text-[15px]">
            Hi, I&apos;m{" "}
            <span className="text-white">Subayu Kalla</span>.
            An Informatics student and Full Stack Developer focused on
            building clean, functional, and solution-driven web applications.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-white/90"
            >
              VIEW PROJECTS →
            </a>

            <a
              href="#contact"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>

        {/* PROFILE */}
        <div className="flex justify-center lg:justify-end">
          <button
            type="button"
            aria-label="Activate profile photo"
            onClick={() => setIsActive(!isActive)}
            className="group relative w-full max-w-[340px] cursor-pointer text-left outline-none"
          >
            <div
              className={`
                relative aspect-[4/5] overflow-hidden rounded-[26px]
                border border-white/10 bg-[#0b0b0b]
                transition-all duration-700 ease-out
                ${
                  isActive
                    ? "rotate-0 scale-100 border-white/20"
                    : "-rotate-2 scale-[0.98] hover:rotate-0 hover:scale-100"
                }
              `}
            >
              {/* PHOTO */}
              <div className="absolute inset-0">
                <img
                  src={profileImage}
                  alt="Subayu Kalla"
                  className={`
                    h-full w-full object-cover
                    transition-all duration-700 ease-out
                    ${
                      isActive
                        ? "scale-100 grayscale-0 brightness-100"
                        : "scale-[1.03] grayscale brightness-[0.65] group-hover:grayscale-0 group-hover:brightness-90"
                    }
                  `}
                />

                {/* DARK GRADIENT */}
                <div
                  className={`
                    absolute inset-0 transition-opacity duration-700
                    ${
                      isActive
                        ? "bg-gradient-to-t from-black via-black/25 to-transparent opacity-90"
                        : "bg-gradient-to-t from-black via-black/40 to-black/10 opacity-100"
                    }
                  `}
                />
              </div>

              {/* TOP LABEL */}
              <div className="absolute left-4 top-4">
                <div className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/55">
                    PROFILE
                  </span>
                </div>
              </div>

              {/* BOTTOM CONTENT */}
              <div className="absolute inset-x-0 bottom-0 p-6 pt-24">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                  SUBAYU KALLA
                </p>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/55">
                  Informatics Student & Full Stack Developer based in Lampung,
                  Indonesia.
                </p>

                {/* INTERACTION HINT */}
                <div
                  className={`
                    mt-4 flex items-center gap-2 transition-all duration-500
                    ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-50"
                    }
                  `}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />

                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/40">
                    {isActive ? "ACTIVE PROFILE" : "TAP TO EXPLORE"}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}