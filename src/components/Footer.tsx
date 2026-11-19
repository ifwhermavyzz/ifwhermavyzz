import { Instagram, ArrowUpRight } from 'lucide-react';
import { BRAND_ASSETS } from '../data/committees';
import { Marquee3D } from './aceternity/Marquee3D';
import { NavSectionId } from './Navbar';

interface FooterProps {
  onNavigate: (section: NavSectionId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 mt-8 bg-[#120A06]/90 backdrop-blur-md">
      {/* Smooth 3D Marquee Band */}
      <Marquee3D text="AURORA SUMMIT 1.0 • A CONSTELLATION OF VOICES" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_ASSETS.logo}
              alt="Aurora Summit 1.0 Logo"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-[#D4AF37]/40 object-cover"
            />
            <div>
              <div className="font-serif text-lg font-semibold text-[#FAF6EE]">
                The Aurora Summit
              </div>
              <p className="text-xs text-[#C5B49A]">
                &copy; 2026 Aurora Summit 1.0. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap items-center gap-5 text-xs text-[#D6C7B2] sm:text-sm"
            >
              {(['home', 'about', 'committees', 'experience', 'game', 'contact'] as NavSectionId[]).map(
                (id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(id);
                    }}
                    className="capitalize transition-colors hover:text-[#F3E5AB]"
                  >
                    {id === 'contact' ? 'Secretariat' : id}
                  </a>
                )
              )}
            </nav>

            <a
              href="https://www.instagram.com/aurorasummitt?lqvp=MWl2cGZoamZzbjY0ZA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow The Aurora Summit on Instagram"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#1A100A] px-4 py-1.5 text-xs font-medium text-[#FAF6EE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D4AF37] hover:text-[#F3E5AB]"
            >
              <Instagram className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Instagram</span>
              <ArrowUpRight className="h-3 w-3 opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
