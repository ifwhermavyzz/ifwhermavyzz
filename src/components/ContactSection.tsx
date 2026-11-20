import { motion } from 'motion/react';
import { Phone, Sparkles } from 'lucide-react';

function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.56 7.47L3 20.5l1.56-5.22A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.3 8.9c.2-.45.42-.46.63-.47h.54c.17 0 .44.06.67.58.25.56.78 1.9.85 2.04.07.14.12.31.02.5-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.37 1.46.3.15.47.12.64-.08.17-.2.74-.86.94-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.49.22.56.34.07.12.07.7-.17 1.38-.24.68-1.4 1.3-1.94 1.38-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.4-.15-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42Z" />
    </svg>
  );
}

interface SecretariatHead {
  role: string;
  name: string;
  title: string;
  phoneDisplay: string;
  waNumber: string;
}

const SECRETARIAT_HEADS: SecretariatHead[] = [
  {
    role: 'Director General',
    name: 'Navya',
    title: 'Director General',
    phoneDisplay: '+91 7292070031',
    waNumber: '917292070031',
  },
  {
    role: 'President',
    name: 'Ishana',
    title: 'President',
    phoneDisplay: '+91 8287139193',
    waNumber: '918287139193',
  },
  {
    role: 'Head of Tech',
    name: 'Mayank',
    title: 'Digital Infrastructure & Systems',
    phoneDisplay: '+91 8178026845',
    waNumber: '918178026845',
  },
];

export function ContactSection() {
  return (
    <section
      id="founder-contact"
      aria-labelledby="founder-contact-heading"
      className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
            05. Direct Inquiries &amp; Leadership
          </p>
          <h2
            id="founder-contact-heading"
            className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl"
          >
            Secretariat Heads &amp; Contact
          </h2>
        </div>

        {/* Founder Primary Card */}
        <div className="aurora-glass relative overflow-hidden rounded-3xl border border-[#D4AF37]/40 px-6 py-7 transition-colors duration-300 hover:border-[#D4AF37]/70 sm:px-10 sm:py-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#D4AF37]/12 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Founder</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-[1.85rem]">
                Trisha Goyal
              </h3>
              <p className="text-sm font-normal text-white/80 sm:text-[15px]">
                Founder &amp; Director
              </p>
            </div>

            <div className="flex flex-col items-start gap-2.5 sm:items-end">
              <span className="text-xs tracking-[0.12em] text-white/60">WhatsApp</span>

              <a
                href="https://wa.me/919625048317"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Trisha Goyal at +91 9625048317"
                className="group inline-flex min-h-[44px] items-center gap-3 rounded-2xl border border-[#D4AF37]/40 bg-[#1A100A]/80 px-4 py-2.5 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/12 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <Phone className="h-3.5 w-3.5 text-[#D4AF37]/85" aria-hidden="true" />
                <span className="tabular-nums tracking-wide text-white">+91 9625048317</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#F3E5AB] transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-[#1A100A]">
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Secretariat Heads Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SECRETARIAT_HEADS.map((head) => (
            <div
              key={head.role}
              className="aurora-glass flex flex-col justify-between gap-4 rounded-2xl border border-[#D4AF37]/25 px-5 py-5 transition-colors duration-200 hover:border-[#D4AF37]/55"
            >
              <div>
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#D4AF37]">
                  {head.role}
                </p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold text-white">
                  {head.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{head.title}</p>
              </div>

              <a
                href={`https://wa.me/${head.waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${head.name} (${head.role}) at ${head.phoneDisplay}`}
                className="group inline-flex min-h-[44px] w-full items-center justify-between gap-2.5 rounded-2xl border border-[#D4AF37]/35 bg-[#1A100A]/80 px-3.5 py-2 text-xs font-medium text-white whitespace-nowrap transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/12 hover:shadow-[0_0_20px_rgba(212,175,55,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#D4AF37]/85" aria-hidden="true" />
                  <span className="tabular-nums tracking-wide text-white">{head.phoneDisplay}</span>
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#F3E5AB] transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-[#1A100A]">
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
