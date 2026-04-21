"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-panel border-b border-[var(--border-subtle)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-[var(--nav-height)] flex items-center justify-between relative">
          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center gap-10 flex-1">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-xs font-[family-name:var(--font-body)] tracking-[0.3em] uppercase transition-colors duration-300",
                  pathname === link.href
                    ? "text-[var(--accent-teal-light)]"
                    : "text-[var(--text-bone-muted)] hover:text-[var(--text-bone)]"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--accent-teal-light)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link href="/" className="relative z-10 flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Image 
                  src="/logo5.svg" 
                  alt="NOÉTIC" 
                  width={96} 
                  height={32} 
                  className="h-6 md:h-8 w-auto invert-0 opacity-90 group-hover:opacity-100 transition-opacity" 
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Right Links */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-end">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-xs font-[family-name:var(--font-body)] tracking-[0.3em] uppercase transition-colors duration-300",
                  pathname === link.href
                    ? "text-[var(--accent-teal-light)]"
                    : "text-[var(--text-bone-muted)] hover:text-[var(--text-bone)]"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--accent-teal-light)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-10 w-8 h-8 flex flex-col items-center justify-center gap-1.5 ml-auto"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-[var(--text-bone)] origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[2px] bg-[var(--text-bone)]"
            />
            <motion.span
              animate={
                menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-[2px] bg-[var(--text-bone)] origin-center"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--bg-deep)]/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "text-3xl font-[family-name:var(--font-heading)] font-bold tracking-wide transition-colors",
                      pathname === link.href
                        ? "text-[var(--accent-teal-light)]"
                        : "text-[var(--text-bone)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
