import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BRAND_ASSETS } from '../data/committees';

export type NavSectionId = 'home' | 'about' | 'committees' | 'experience' | 'game' | 'contact';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (section: NavSectionId) => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'committees', label: 'Committees' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Secretariat' },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: NavSectionId) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-3.5 sm:px-6 sm:pt-5">
      <div className="pointer-events-auto aurora-glass-pill flex w-full max-w-5xl items-center justify-between gap-6 rounded-full px-4 py-2 sm:px-6 sm:py-2.5">
        {/* Brand Logo & Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <img
            src={BRAND_ASSETS.logo}
            alt="Aurora Summit 1.0 Crest"
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full border border-[#D4AF37]/40 object-cover sm:h-9 sm:w-9"
          />
          <span className="font-serif text-base font-semibold tracking-wide text-[#FAF6EE] transition-colors hover:text-[#F3E5AB] sm:text-lg">
            Aurora Summit
          </span>
        </a>

        {/* Desktop Links */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative py-1 text-sm font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] ${
                  isActive ? 'text-[#F3E5AB]' : 'text-[#D6C7B2] hover:text-[#FAF6EE]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute right-0 -bottom-0.5 left-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#FAF6EE] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Floating Glass Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto aurora-glass mt-2.5 flex w-full max-w-5xl flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#F3E5AB]'
                      : 'text-[#D6C7B2] hover:bg-white/5 hover:text-[#FAF6EE]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
