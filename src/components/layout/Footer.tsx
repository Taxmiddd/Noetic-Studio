"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/TheNoeticStudio" },
  { label: "Instagram", href: "https://instagram.com/thenoeticstudio" },
  { label: "LinkedIn", href: "https://linkedin.com/company/noetic-studio" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Pricing", href: "/pricing" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-[var(--bg-deep)] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between gap-8">
            <div>
              <Image 
                src="/logo5.svg" 
                alt="NOÉTIC" 
                width={24} 
                height={24} 
                className="h-6 w-auto brightness-[0.6] mb-4" 
              />
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 font-[family-name:var(--font-body)] leading-relaxed">
                Clarity.<br />Mandated.
              </p>
            </div>
            <p className="text-[10px] text-white/20 font-[family-name:var(--font-body)] tracking-wider uppercase">
              © {new Date().getFullYear()} NOÉTIC Studio
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 font-[family-name:var(--font-body)] mb-5">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[var(--accent-teal-light)] transition-colors duration-300 font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 font-[family-name:var(--font-body)] mb-5">Social</p>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/90 hover:text-[var(--accent-teal-light)] transition-colors duration-300 font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 font-[family-name:var(--font-body)] mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@noeticstudio.net"
                  className="text-sm text-white/90 hover:text-[var(--accent-teal-light)] transition-colors duration-300 font-[family-name:var(--font-body)]"
                >
                  contact@noeticstudio.net
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://wa.me/8801755831289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/90 hover:text-[var(--accent-teal-light)] transition-colors duration-300 font-[family-name:var(--font-body)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.966-.944 1.162-.175.195-.349.21-.646.065-.3-.15-1.265-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.525.146-.18.194-.3.297-.495.098-.21.046-.39-.029-.54-.075-.15-.671-1.62-.92-2.205-.243-.585-.487-.51-.671-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.205 5.076 4.485.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.195-.572-.345z"/>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.756.449 3.411 1.238 4.861L2 22l5.35-1.18A9.957 9.957 0 0 0 12 22z"/>
                  </svg>
                  +8801755831289
                </a>
              </li>
              <li className="pt-4 border-t border-white/[0.06]">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors font-[family-name:var(--font-body)] mb-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Developed by credit */}
      <div className="border-t border-white/[0.04] py-4 px-6 flex justify-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 font-[family-name:var(--font-body)]">
          Developed by{" "}
          <a href="https://noeticstudio.net" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">
            NOÉTIC Studio
          </a>
        </p>
      </div>
    </footer>
  );
}
