"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CERTIFICATES", href: "#certificates" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <nav
        className={`mx-auto max-w-[940px] rounded-full border px-4 py-3 transition-all duration-500 sm:px-5 ${
          isScrolled
            ? "border-white/15 bg-black/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "border-white/10 bg-black/80 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <a
            href="#home"
            onClick={closeMenu}
            className="group text-sm font-semibold tracking-tight sm:text-base"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent transition-all duration-500 group-hover:from-white group-hover:via-white group-hover:to-white">
              subayu kalla
            </span>
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-2 text-sm text-white/55 transition-colors duration-300 hover:text-white"
              >
                {item.label}

                <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* GET IN TOUCH */}
          <a
            href="#contact"
            className="group hidden items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 md:flex"
          >
            <span>GET IN TOUCH</span>

            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-300 hover:border-white/20 hover:bg-white/5 md:hidden"
          >
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={`block h-px w-full bg-white transition-all duration-300 ${
                  isOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />

              <span
                className={`block h-px w-full bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`block h-px w-full bg-white transition-all duration-300 ${
                  isOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`overflow-hidden transition-all duration-500 md:hidden ${
            isOpen
              ? "max-h-[400px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/55 transition-all duration-300 hover:bg-white/[0.04] hover:pl-5 hover:text-white"
                >
                  <span>{item.label}</span>

                  <span className="translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </a>
              ))}

              <a
                href="#contact"
                onClick={closeMenu}
                className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90"
              >
                <span>GET IN TOUCH</span>

                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}