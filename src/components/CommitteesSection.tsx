import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Globe,
  Landmark,
  Scale,
  ArrowUpRight,
  X,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { COMMITTEES, Committee } from '../data/committees';
import { SplitText } from './reactbits/TextAnimations';
import { TiltedBorderCard } from './reactbits/TiltedBorderCard';

interface CommitteesSectionProps {
  onSelectCommitteeForReg: (committeeId: Committee['id']) => void;
}

function CommitteeIcon({ name }: { name: Committee['iconName'] }) {
  const cls = 'h-5 w-5 text-[#F3E5AB]';
  switch (name) {
    case 'shield':
      return <Shield className={cls} strokeWidth={1.6} />;
    case 'globe':
      return <Globe className={cls} strokeWidth={1.6} />;
    case 'landmark':
      return <Landmark className={cls} strokeWidth={1.6} />;
    case 'scale':
      return <Scale className={cls} strokeWidth={1.6} />;
  }
}

export function CommitteesSection({ onSelectCommitteeForReg }: CommitteesSectionProps) {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

  useEffect(() => {
    if (!selectedCommittee) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCommittee(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCommittee]);

  return (
    <section
      id="committees"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
            02. Chambers of Debate
          </p>
          <SplitText
            text="The Committees"
            as="h2"
            className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-[2.75rem]"
          />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#94A3B8]">
          Four asymmetric councils structured for crisis intervention, plenary consensus,
          constitutional federalism, and frontier human rights law.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COMMITTEES.map((committee, idx) => {
          // Asymmetric Bento Sizing: UNSC (idx 0) and UNHRC (idx 3) span 2 columns on desktop
          const isWide = idx === 0 || idx === 3;
          const spanClass = isWide ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1 lg:col-span-1';

          return (
            <motion.div
              key={committee.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={spanClass}
            >
              <TiltedBorderCard maxTilt={isWide ? 4.5 : 6}>
                <div
                  className={`flex h-full flex-col justify-between p-6 sm:p-8 ${
                    isWide ? 'lg:flex-row lg:items-stretch lg:gap-8' : ''
                  }`}
                >
                  {/* Primary Text & Actions */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {/* Clean unboxed metadata row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                        <span className="font-medium text-[#D4AF37]">{committee.tier}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{committee.delegatesCount} Delegates</span>
                      </div>

                      <div className="mt-4 flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          <CommitteeIcon name={committee.iconName} />
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-[1.65rem]">
                            {committee.acronym}
                          </h3>
                          <p className="text-xs text-[#CBD5E1]">{committee.name}</p>
                        </div>
                      </div>

                      <p className="mt-5 text-sm font-medium leading-snug text-[#F3E5AB] sm:text-base">
                        {committee.agenda}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                        {committee.summary}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                      <button
                        type="button"
                        onClick={() => setSelectedCommittee(committee)}
                        className="group inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs font-medium tracking-wide text-[#F8FAFC] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/15 hover:text-[#F3E5AB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                      >
                        <span>Read More</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      <span className="text-xs text-[#64748B] tabular-nums">
                        Council 0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Asymmetric Visual CSS Gradient Panel on Wide Bento Cards */}
                  {isWide && (
                    <div
                      className="relative mt-6 flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 lg:mt-0 lg:w-64 lg:shrink-0"
                      style={{ background: committee.accentGradient }}
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full border border-[#D4AF37]/25"
                      />
                      <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
                        <span>Key Dossier</span>
                        <Users className="h-3.5 w-3.5 text-[#D4AF37]" />
                      </div>
                      <ul className="my-4 space-y-2 text-xs leading-relaxed text-[#E2E8F0]">
                        {committee.focusPoints.slice(0, 2).map((pt) => (
                          <li key={pt} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-[11px] font-medium tracking-wide text-[#F3E5AB]">
                        Background Guide Ready
                      </div>
                    </div>
                  )}
                </div>
              </TiltedBorderCard>
            </motion.div>
          );
        })}
      </div>

      {/* Committee Dossier Modal */}
      <AnimatePresence>
        {selectedCommittee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedCommittee(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="committee-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="luxury-glass relative w-full max-w-2xl overflow-hidden rounded-3xl p-6 sm:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                    <span>{selectedCommittee.tier}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {selectedCommittee.delegatesCount} Delegate Seats
                    </span>
                  </div>
                  <h3
                    id="committee-modal-title"
                    className="mt-2 font-serif text-2xl font-semibold text-[#F8FAFC] sm:text-3xl"
                  >
                    {selectedCommittee.acronym} — {selectedCommittee.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCommittee(null)}
                  aria-label="Close committee details"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#CBD5E1] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
                <div>
                  <div className="text-xs font-medium tracking-[0.14em] text-[#94A3B8]">
                    Agenda Item
                  </div>
                  <p className="mt-1.5 font-serif text-lg text-[#F3E5AB]">
                    {selectedCommittee.agenda}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-medium tracking-[0.14em] text-[#94A3B8]">
                    Chamber Mandate
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#CBD5E1]">
                    {selectedCommittee.mandate}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-medium tracking-[0.14em] text-[#94A3B8]">
                    Core Thematic Pillars
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {selectedCommittee.focusPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-[#E2E8F0]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedCommittee(null)}
                  className="min-h-[42px] rounded-full border border-white/10 px-5 py-2 text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedCommittee.id;
                    setSelectedCommittee(null);
                    onSelectCommitteeForReg(id);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667] px-6 py-2 text-xs font-semibold text-[#050505] transition-transform active:scale-[0.98]"
                >
                  <span>Select in Registration</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
