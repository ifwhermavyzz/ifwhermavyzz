import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Camera,
  Coffee,
  Disc3,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { CONFERENCE_HIGHLIGHTS, ExperienceHighlight } from '../data/committees';
import { HoverBorderGradient } from './aceternity/HoverBorderGradient';
import { CardSpotlight } from './aceternity/CardSpotlight';
import { WobbleCard } from './aceternity/WobbleCard';

function HighlightIcon({ name }: { name: ExperienceHighlight['icon'] }) {
  const cls = 'h-5 w-5 text-[#F3E5AB]';
  switch (name) {
    case 'briefcase':
      return <Briefcase className={cls} strokeWidth={1.6} />;
    case 'camera':
      return <Camera className={cls} strokeWidth={1.6} />;
    case 'coffee':
      return <Coffee className={cls} strokeWidth={1.6} />;
    case 'users':
      return <Users className={cls} strokeWidth={1.6} />;
    case 'disc':
      return <Disc3 className={cls} strokeWidth={1.6} />;
    case 'trophy':
      return <Trophy className={cls} strokeWidth={1.6} />;
    case 'sparkles':
      return <Sparkles className={cls} strokeWidth={1.6} />;
  }
}

export const ExperienceSection = React.memo(function ExperienceSection() {
  const [twistPeek, setTwistPeek] = useState(false);

  return (
    <section
      id="experience"
      className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
            03. Beyond the Gavel
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#FAF6EE] sm:text-4xl lg:text-[2.75rem]">
            Conference Highlights
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#D6C7B2]">
          Every detail of Aurora Summit 1.0—from welcome dossiers to late-night galas—is crafted
          for an unforgettable delegation experience.
        </p>
      </motion.div>

      {/* Bento Grid for the 7 Experience Highlights with WobbleCard & HoverBorderGradient */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CONFERENCE_HIGHLIGHTS.map((item, idx) => {
          const isSurprise = Boolean(item.isSurprise);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={item.spanClass}
            >
              <WobbleCard containerClassName="h-full">
                <HoverBorderGradient roundedClassName="rounded-3xl" containerClassName="h-full">
                  <CardSpotlight className="flex h-full flex-col justify-between rounded-3xl p-6">
                    <div
                      onMouseEnter={() => isSurprise && setTwistPeek(true)}
                      onMouseLeave={() => isSurprise && setTwistPeek(false)}
                      onClick={() => isSurprise && setTwistPeek((v) => !v)}
                      className={isSurprise ? 'cursor-pointer' : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium tracking-[0.14em] text-[#D4AF37]">
                          {item.kicker}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#1A100A]/85">
                          <HighlightIcon name={item.icon} />
                        </div>
                      </div>

                      <h3 className="mt-5 font-serif text-2xl font-semibold text-[#FAF6EE]">
                        {item.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#D6C7B2]">
                        {isSurprise && twistPeek
                          ? 'Midnight Cross-Council Joint Crisis Dispatch — alliances tested in real time across every chamber.'
                          : item.description}
                      </p>
                    </div>

                    {isSurprise && (
                      <div className="mt-4 border-t border-[#D4AF37]/20 pt-3 text-xs font-medium text-[#F3E5AB]">
                        {twistPeek ? 'Transmission Decoded' : 'Hover or tap to preview hint'}
                      </div>
                    )}
                  </CardSpotlight>
                </HoverBorderGradient>
              </WobbleCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
