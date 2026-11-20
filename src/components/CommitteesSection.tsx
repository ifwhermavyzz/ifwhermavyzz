import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, EyeOff, Lock, Sparkles, X } from 'lucide-react';
import { BRAND_ASSETS, COMMITTEES, Committee } from '../data/committees';
import { CardContainer, CardBody, CardItem } from './aceternity/ThreeDCard';
import { WobbleCard } from './aceternity/WobbleCard';
import { HoverBorderGradient } from './aceternity/HoverBorderGradient';
import { CardSpotlight } from './aceternity/CardSpotlight';

interface CommitteesSectionProps {
  onRegisterCommittee: () => void;
}

function ScrollAnimatedCommitteeCard({
  committee,
  index,
  onSelect,
}: {
  committee: Committee;
  index: number;
  onSelect: (c: Committee) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.98', 'end 0.2'],
  });

  const scrollTiltX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.45], [0.94, 1]);

  return (
    <div ref={cardRef} className="flex">
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX: scrollTiltX,
                scale: scrollScale,
                transformPerspective: 1000,
              }
        }
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full will-change-transform"
      >
        <WobbleCard containerClassName="w-full">
          <CardContainer containerClassName="w-full h-full" className="w-full h-full">
            <CardBody className="w-full h-full">
              <HoverBorderGradient roundedClassName="rounded-3xl" containerClassName="h-full">
                <CardSpotlight className="flex h-full flex-col justify-between rounded-3xl p-4 sm:p-5">
                  <div>
                    {/* Poster Asset with 3D Z-elevation */}
                    <CardItem translateZ={42} className="w-full">
                      <div
                        onClick={() => onSelect(committee)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect(committee);
                          }
                        }}
                        aria-label={`Inspect ${committee.acronym} poster`}
                        className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-[#D4AF37]/45 bg-[#120A06] shadow-[0_0_24px_-6px_rgba(212,175,55,0.28)]"
                      >
                        <img
                          src={committee.posterUrl}
                          alt={`${committee.acronym} - ${committee.name} Poster`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A100A]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </div>
                    </CardItem>

                    {/* Metadata & Title */}
                    <CardItem translateZ={26} className="mt-4 w-full">
                      <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                        <span>{committee.tier}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{committee.delegatesCount} Seats</span>
                      </div>
                      <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#FAF6EE]">
                        {committee.acronym} — {committee.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#D6C7B2] sm:text-sm">
                        {committee.summary}
                      </p>
                    </CardItem>
                  </div>

                  <CardItem translateZ={32} className="mt-5 w-full border-t border-[#D4AF37]/20 pt-4">
                    <button
                      type="button"
                      onClick={() => onSelect(committee)}
                      className="group inline-flex min-h-[42px] w-full items-center justify-between rounded-full border-2 border-[#D4AF37]/60 bg-[#1A100A]/85 px-5 py-2 text-xs font-semibold tracking-wide text-[#F3E5AB] shadow-[0_0_18px_-4px_rgba(212,175,55,0.3)] transition-all duration-200 hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 hover:shadow-[0_0_26px_rgba(212,175,55,0.5)]"
                    >
                      <span>View Chamber Dossier</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </CardItem>
                </CardSpotlight>
              </HoverBorderGradient>
            </CardBody>
          </CardContainer>
        </WobbleCard>
      </motion.div>
    </div>
  );
}

export const CommitteesSection = React.memo(function CommitteesSection({
  onRegisterCommittee,
}: CommitteesSectionProps) {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);

  useEffect(() => {
    if (!selectedCommittee) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCommittee(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCommittee]);

  return (
    <section
      id="committees"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
            02. Chambers of Debate
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#FAF6EE] sm:text-4xl lg:text-[2.75rem]">
            The Committees
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#D6C7B2]">
          Every poster card wobbles and tilts in 3D as you scroll or glide across it—plus inspect
          the classified surprise chamber below.
        </p>
      </motion.div>

      {/* 6 Attached Committee Posters Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {COMMITTEES.map((committee, idx) => (
          <ScrollAnimatedCommitteeCard
            key={committee.id}
            committee={committee}
            index={idx}
            onSelect={setSelectedCommittee}
          />
        ))}

        {/* The Surprise Card (Classified / Locked UI) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="md:col-span-2 lg:col-span-3"
        >
          <WobbleCard>
            <HoverBorderGradient roundedClassName="rounded-3xl" containerClassName="w-full">
              <div
                onMouseEnter={() => setSurpriseRevealed(true)}
                onMouseLeave={() => setSurpriseRevealed(false)}
                onClick={() => setSurpriseRevealed((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSurpriseRevealed((v) => !v);
                  }
                }}
                aria-label="Classified Committee Surprise — Hover or tap to inspect"
                className="aurora-glass relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center sm:min-h-[300px] sm:p-12"
              >
                <img
                  src={BRAND_ASSETS.eclipseSpaceBg}
                  alt=""
                  referrerPolicy="no-referrer"
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    surpriseRevealed ? 'scale-105 opacity-45 blur-[1px]' : 'opacity-25 blur-sm'
                  }`}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1A100A]/80 via-[#1A100A]/65 to-[#120A06]/90"
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300 ${
                      surpriseRevealed
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 shadow-[0_0_36px_rgba(212,175,55,0.45)]'
                        : 'border-[#D4AF37]/40 bg-[#1A100A]/85'
                    }`}
                  >
                    {surpriseRevealed ? (
                      <Sparkles className="h-7 w-7 text-[#F3E5AB]" />
                    ) : (
                      <Lock className="h-7 w-7 text-[#D4AF37]" />
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium tracking-[0.22em] text-[#D4AF37]">
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>CLASSIFIED CHAMBER DOSSIER</span>
                  </div>

                  <div className="mt-3 flex min-h-[68px] flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      {surpriseRevealed ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                          transition={{ duration: 0.25 }}
                        >
                          <h3 className="font-serif text-2xl font-semibold text-[#F3E5AB] sm:text-3xl">
                            Surprise will be revealed soon...
                          </h3>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="locked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <h3 className="font-serif text-2xl font-semibold tracking-wider text-[#FAF6EE] sm:text-3xl">
                            [ ACCESS RESTRICTED · SURPRISE ]
                          </h3>
                          <p className="text-xs text-[#C5B49A] sm:text-sm">
                            Hover or tap to inspect the classified transmission
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </HoverBorderGradient>
          </WobbleCard>
        </motion.div>
      </div>

      {/* Poster & Dossier Inspection Modal */}
      <AnimatePresence>
        {selectedCommittee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCommittee(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="committee-dossier-title"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="aurora-glass relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-5 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedCommittee(null)}
                aria-label="Close committee dossier"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#1A100A]/85 text-[#FAF6EE] hover:border-[#D4AF37]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="md:col-span-5">
                  <img
                    src={selectedCommittee.posterUrl}
                    alt={`${selectedCommittee.acronym} Poster`}
                    referrerPolicy="no-referrer"
                    className="w-full rounded-2xl border border-[#D4AF37]/30 object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between md:col-span-7">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                      <span>{selectedCommittee.tier}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {selectedCommittee.delegatesCount} Seats
                      </span>
                    </div>
                    <h3
                      id="committee-dossier-title"
                      className="mt-2 font-serif text-2xl font-semibold text-[#FAF6EE] sm:text-3xl"
                    >
                      {selectedCommittee.acronym} — {selectedCommittee.name}
                    </h3>

                    <div className="mt-4 border-t border-[#D4AF37]/20 pt-4">
                      <p className="text-xs font-medium tracking-[0.14em] text-[#C5B49A]">
                        Official Agenda
                      </p>
                      <p className="mt-1 font-serif text-base leading-relaxed text-[#F3E5AB]">
                        {selectedCommittee.agenda}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#D6C7B2]">
                      {selectedCommittee.mandate}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {selectedCommittee.focusPoints.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-[#FAF6EE] sm:text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#D4AF37]/20 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCommittee(null)}
                      className="min-h-[42px] rounded-full border border-[#D4AF37]/30 px-5 py-2 text-xs font-medium text-[#D6C7B2] hover:text-white"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCommittee(null);
                        onRegisterCommittee();
                      }}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667] px-6 py-2 text-xs font-semibold text-[#1A100A]"
                    >
                      <span>Apply for Secretariat</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});
