import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { CardSpotlight } from './aceternity/CardSpotlight';
import { HoverBorderGradient } from './aceternity/HoverBorderGradient';
import { WobbleCard } from './aceternity/WobbleCard';
import { OdometerNumber, ScrollIlluminatedLineup } from './aceternity/TextGenerateEffect';

const AuroraAstrolabe3D = lazy(() => import('./three/AuroraAstrolabe3D'));

const STARRING_CHAMBERS = ['UNEP', 'UNCSW', 'IPL', 'CBI', 'IPC', 'AIPPM', 'SURPRISE'];

export const AboutSection = React.memo(function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="mb-8 max-w-2xl"
      >
        <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
          01. The Diplomatic Mandate
        </p>
        <h2 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#FAF6EE] sm:text-4xl lg:text-[2.75rem] [text-wrap:balance]">
          About Aurora Summit 1.0
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <WobbleCard>
          <HoverBorderGradient roundedClassName="rounded-3xl">
            <CardSpotlight className="rounded-3xl p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="flex flex-col justify-between lg:col-span-7">
                  <div className="space-y-5">
                    <p className="font-serif text-xl leading-relaxed text-[#FAF6EE] sm:text-2xl">
                      Built around the theme{' '}
                      <span className="italic text-[#E5C667]">A Constellation of Voices</span>,
                      Aurora Summit 1.0 unites bold speakers, investigative journalists, and crisis
                      strategists under one celestial roof.
                    </p>
                    <p className="text-base leading-relaxed text-[#D6C7B2] sm:text-[17px]">
                      Across two days of rigorous committee debate, live forensic mystery solving,
                      franchise auction war-rooms, and parliamentary negotiation, delegates move
                      beyond scripted speeches to craft real consensus. Every chamber is backed by
                      curated background guides, seasoned executive boards, and unforgettable social
                      nights.
                    </p>
                  </div>

                  {/* Rolling Odometer Stats inspired by jjettas.com & book.sequel.co */}
                  <div className="mt-9 grid grid-cols-3 gap-6 border-t border-[#D4AF37]/20 pt-7">
                    <div>
                      <div className="font-serif text-3xl font-semibold text-[#F3E5AB] sm:text-4xl">
                        <OdometerNumber target={7} />
                      </div>
                      <div className="mt-1 text-xs text-[#C5B49A] sm:text-sm">
                        Chambers &amp; Mystery
                      </div>
                    </div>
                    <div>
                      <div className="font-serif text-3xl font-semibold text-[#FAF6EE] sm:text-4xl">
                        <OdometerNumber target={260} suffix="+" />
                      </div>
                      <div className="mt-1 text-xs text-[#C5B49A] sm:text-sm">Delegate Seats</div>
                    </div>
                    <div>
                      <div className="font-serif text-3xl font-semibold text-[#FAF6EE] sm:text-4xl">
                        <OdometerNumber target={1} decimals={1} />
                      </div>
                      <div className="mt-1 text-xs text-[#C5B49A] sm:text-sm">
                        Inaugural Edition
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lazy-loaded R3F 3D Interactive Astrolabe */}
                <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#140C07]/80 lg:col-span-5">
                  <Suspense
                    fallback={
                      <div className="flex h-[300px] items-center justify-center text-xs tracking-widest text-[#D4AF37]/70 sm:h-[340px]">
                        Loading 3D Astrolabe...
                      </div>
                    }
                  >
                    <AuroraAstrolabe3D />
                  </Suspense>
                </div>
              </div>
            </CardSpotlight>
          </HoverBorderGradient>
        </WobbleCard>
      </motion.div>

      {/* book.sequel.co-inspired Scroll-Illuminated Chamber Lineup */}
      <div className="mt-14 border-y border-[#D4AF37]/15 py-4 text-center">
        <p className="text-[11px] font-medium tracking-[0.24em] text-[#C5B49A]">
          FEATURING CHAMBERS
        </p>
        <ScrollIlluminatedLineup items={STARRING_CHAMBERS} />
      </div>
    </section>
  );
});
