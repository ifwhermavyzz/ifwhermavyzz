import { Instagram, ArrowUpRight } from 'lucide-react';
import { ShinyText } from './reactbits/TextAnimations';
import { NavSectionId } from './Navbar';

interface FooterProps {
  onNavigate: (section: NavSectionId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/10 bg-[#050505]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-24">
        {/* Massive Cinematic Typography with ShinyText */}
        <div className="overflow-hidden border-b border-white/10 pb-12 text-center sm:pb-16">
          <p className="mb-3 text-xs font-medium tracking-[0.22em] text-[#94A3B8]">
            A Constellation of Voices
          </p>
          <h2 className="font-serif text-[clamp(2.35rem,7.2vw,6.25rem)] leading-[0.98] font-semibold tracking-tight">
            <ShinyText>The Aurora Summit</ShinyText>
          </h2>
        </div>

        {/* Bottom Links, Instagram & Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 text-sm text-[#94A3B8] sm:flex-row">
          <p className="text-center text-xs sm:text-left sm:text-sm">
            &copy; 2026 The Aurora Summit Model United Nations. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <nav aria-label="Footer Navigation" className="flex items-center gap-5 text-xs sm:text-sm">
              {(['home', 'about', 'committees', 'contact'] as NavSectionId[]).map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(id);
                  }}
                  className="capitalize transition-colors hover:text-[#F3E5AB]"
                >
                  {id}
                </a>
              ))}
            </nav>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow The Aurora Summit on Instagram"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[#F8FAFC] whitespace-nowrap shrink-0 transition-colors hover:border-[#D4AF37]/60 hover:text-[#F3E5AB] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <Instagram className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Instagram</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
