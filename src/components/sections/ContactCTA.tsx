"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";

export function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding" id="cta">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl">
            Let&apos;s{" "}
            <span className="gradient-text">Create.</span>
          </h2>
          <p className="text-body text-base md:text-lg max-w-xl mx-auto">
            Have a project in mind? We'd love to hear about it. Let's discuss how NOÉTIC can bring clarity to your vision.
          </p>
          <MagneticButton strength={20}>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="gap-2">
                Start a Conversation
                <ArrowRight size={18} />
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
