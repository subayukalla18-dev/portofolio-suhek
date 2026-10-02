import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl border-t border-white/10 px-6 py-24 md:px-8"
    >
      {/* Contact Header */}
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        {/* Left Content */}
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
              Get In Touch
            </p>

            <h2 className="mt-4 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[44px]">
              Let&apos;s work
              <br />
              together.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/50 sm:text-[15px]">
              Have a project in mind, need a developer, or just want to
              connect? Feel free to reach out.
            </p>
          </div>
        </Reveal>

        {/* Right Content */}
        <div className="grid gap-3">
          {/* Email */}
          <Reveal delay={150}>
            <a
              href="mailto:Subayukalla18@gmail.com"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.99 1.99 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>

                <div>
                  <p className="font-mono text-[11px] text-white/40">
                    Direct Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Subayukalla18@gmail.com
                  </p>
                </div>
              </div>

              <span className="text-lg text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </Reveal>

          {/* Social Media */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* GitHub */}
            <Reveal delay={250}>
              <a
                href="https://github.com/subayukalla18-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center rounded-2xl border border-white/10 p-4 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/60 transition-colors group-hover:text-white"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-1.5 6-6a4.6 4.6 0 0 0-1-3.2A4.2 4.2 0 0 0 19.9 2S18.7 1.6 15 4.1a13.4 13.4 0 0 0-6 0C5.3 1.6 4.1 2 4.1 2A4.2 4.2 0 0 0 5 5.3a4.6 4.6 0 0 0-1 3.2c0 4.5 3 6 6 6a4.8 4.8 0 0 0-1 3.5v4" />
                    <path d="M9 18c-4.5 2-5-2-7-2" />
                  </svg>

                  <span className="font-mono text-[11px] text-white/50 group-hover:text-white/80">
                    GitHub
                  </span>
                </div>
              </a>
            </Reveal>

            {/* LinkedIn */}
            <Reveal delay={350}>
              <a
                href="https://www.linkedin.com/in/subayu-kalla/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center rounded-2xl border border-white/10 p-4 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/60 transition-colors group-hover:text-white"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <path d="M8 11v5" />
                    <path d="M8 8v.01" />
                    <path d="M12 16v-5" />
                    <path d="M12 13a3 3 0 0 1 6 0v3" />
                  </svg>

                  <span className="font-mono text-[11px] text-white/50 group-hover:text-white/80">
                    LinkedIn
                  </span>
                </div>
              </a>
            </Reveal>

            {/* Instagram */}
            <Reveal delay={450}>
              <a
                href="https://www.instagram.com/subayu_kalla"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center rounded-2xl border border-white/10 p-4 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/60 transition-colors group-hover:text-white"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M17.5 6.5h.01" />
                  </svg>

                  <span className="font-mono text-[11px] text-white/50 group-hover:text-white/80">
                    Instagram
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Reveal delay={550}>
        <footer className="mt-24 border-t border-white/10 pt-5">
          <div className="flex flex-col justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="font-mono text-[11px] text-white/35">
              © {new Date().getFullYear()} Subayu Kalla. All rights reserved.
            </p>

            <p className="font-mono text-[11px] text-white/35">
              Built with Next.js & Tailwind CSS.
            </p>
          </div>
        </footer>
      </Reveal>
    </section>
  );
}