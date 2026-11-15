import { motion } from 'motion/react';
import { Sparkles, Compass, Globe2 } from 'lucide-react';
import { SplitText } from './reactbits/TextAnimations';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
          01. The Diplomatic Mandate
        </p>
        <SplitText
          text="About The Aurora Summit"
          as="h2"
          className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-[2.75rem] [text-wrap:balance]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="luxury-glass overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
      >
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Narrative */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div className="space-y-5">
              <p className="font-serif text-xl leading-relaxed text-[#F8FAFC] sm:text-2xl">
                Inspired by the clarity of polar starlight, The Aurora Summit convenes principled
                debates where every delegation illuminates a shared horizon.
              </p>
              <p className="text-base leading-relaxed text-[#CBD5E1] sm:text-[17px]">
                Hosted as a three-day Model United Nations conclave, the summit challenges university
                and high-school delegates to move beyond rehearsed speeches into substantive treaty
                drafting, crisis simulation, and coalition diplomacy. Guided by the theme{' '}
                <span className="font-medium text-[#F3E5AB]">A Constellation of Voices</span>,
                each chamber pairs rigorous research with live parliamentary negotiation so diverse
                perspectives converge into actionable international consensus.
              </p>
            </div>

            {/* Clean quantitative metrics with tabular numerals & hairline dividers */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <div className="font-serif text-2xl font-semibold text-[#F3E5AB] tabular-nums sm:text-3xl">
                  4
                </div>
                <div className="mt-1 text-xs text-[#94A3B8] sm:text-sm">Specialized Councils</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-semibold text-[#F8FAFC] tabular-nums sm:text-3xl">
                  178
                </div>
                <div className="mt-1 text-xs text-[#94A3B8] sm:text-sm">Delegate Portfolios</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-semibold text-[#F8FAFC] tabular-nums sm:text-3xl">
                  3 Days
                </div>
                <div className="mt-1 text-xs text-[#94A3B8] sm:text-sm">Debate &amp; Drafting</div>
              </div>
            </div>
          </div>

          {/* Pure CSS Gradient & Icon Celestial Emblem Panel (no external images) */}
          <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 lg:col-span-5"
            style={{
              background:
                'radial-gradient(circle at 75% 22%, rgba(212, 175, 55, 0.22) 0%, rgba(17, 24, 48, 0.65) 48%, rgba(5, 5, 5, 0.92) 100%)',
            }}
          >
            {/* Geometric orbital rings built with CSS */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            />

            <div className="relative z-10 flex items-center justify-between text-xs tracking-[0.16em] text-[#CBD5E1]">
              <span>Summit Charter</span>
              <Compass className="h-4 w-4 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 my-8 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#080C18]/80 shadow-[0_0_40px_rgba(212,175,55,0.22)]">
                <Globe2 className="h-9 w-9 text-[#F3E5AB]" strokeWidth={1.5} />
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#F3E5AB]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Parliamentary Rules of Procedure</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
                Curated background guides, real-time crisis updates, and dedicated executive boards.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
