"use client";

const partners = [
  "MERIDIAN",
  "APEX",
  "PRISM",
  "VOLTA",
  "HELIOS",
  "AETHER",
  "LUMINAR",
  "ZENITH",
];

export function PartnersMarquee() {
  return (
    <section className="py-20 overflow-hidden border-y border-[var(--border-subtle)]" id="partners">
      <div className="mb-12 text-center">
        <span className="text-label">Trusted By</span>
      </div>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-deep)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-deep)] to-transparent z-10" />

        {/* Scrolling track */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner}-${i}`}
              className="flex items-center justify-center mx-12 md:mx-16"
            >
              <span className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold text-[var(--text-bone-dim)] hover:text-[var(--text-bone-muted)] transition-colors duration-500 tracking-[0.15em]">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
