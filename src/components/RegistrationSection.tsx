import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { COMMITTEES, Committee } from '../data/committees';
import { SplitText } from './reactbits/TextAnimations';

export type RegistrationMode = 'delegate' | 'secretariat';

interface RegistrationSectionProps {
  mode: RegistrationMode;
  onModeChange: (mode: RegistrationMode) => void;
  preferredCommittee: Committee['id'] | '';
  onPreferredCommitteeChange: (val: Committee['id'] | '') => void;
}

interface FloatingInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={`relative rounded-2xl border bg-white/[0.03] transition-all duration-200 ${
          error
            ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
            : focused
              ? 'border-[#D4AF37]/80 bg-white/[0.05] shadow-[0_0_26px_rgba(212,175,55,0.22)]'
              : 'border-white/12 hover:border-white/25'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            isFloating
              ? 'top-2 text-[11px] font-medium tracking-wide text-[#F3E5AB]'
              : 'top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent px-4 pt-6 pb-2.5 text-sm text-[#F8FAFC] outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 pl-1 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function RegistrationSection({
  mode,
  onModeChange,
  preferredCommittee,
  onPreferredCommitteeChange,
}: RegistrationSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [committeeFocused, setCommitteeFocused] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    committee?: string;
  }>({});

  // Clear confirmation banner automatically after a calm reading pause
  useEffect(() => {
    if (!submittedNotice) return;
    const timer = window.setTimeout(() => setSubmittedNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [submittedNotice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }
    if (!preferredCommittee) {
      nextErrors.committee = 'Please select a committee preference.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmittedNotice(null);
      return;
    }

    const applicantName = name.trim();
    const chosenCommittee = preferredCommittee;

    // Reset form on submit as requested
    setName('');
    setEmail('');
    setPhone('');
    onPreferredCommitteeChange('');
    setErrors({});
    setSubmittedNotice(
      mode === 'delegate'
        ? `Thank you, ${applicantName}. Delegate interest for ${chosenCommittee} has been recorded and the form has been reset.`
        : `Thank you, ${applicantName}. Secretariat application (${chosenCommittee} track) has been recorded and the form has been reset.`
    );
  };

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mb-10 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
          03. Delegate &amp; Secretariat Intake
        </p>
        <SplitText
          text="Reserve Your Voice"
          as="h2"
          className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-[2.75rem]"
        />
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
          Submit your registration preferences below. Our allocations desk reviews delegate and
          secretariat dossiers on a rolling basis.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="luxury-glass rounded-3xl p-6 sm:p-10"
      >
        {/* Mode Switcher with Framer Motion layoutId */}
        <div className="mb-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Application Type"
            className="inline-flex rounded-full border border-white/10 bg-black/40 p-1"
          >
            {(
              [
                { id: 'delegate', label: 'Delegate Registration' },
                { id: 'secretariat', label: 'Secretariat Application' },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onModeChange(tab.id)}
                  className={`relative rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors sm:px-5 sm:text-sm ${
                    active ? 'text-[#050505]' : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="regModeTab"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FloatingInput
              id="reg-name"
              label="Full Name"
              value={name}
              onChange={(val) => {
                setName(val);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
            />

            <FloatingInput
              id="reg-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(val) => {
                setEmail(val);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FloatingInput
              id="reg-phone"
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(val) => {
                setPhone(val);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              error={errors.phone}
            />

            {/* Floating-Label Committee Preference Select */}
            <div className="relative">
              <div
                className={`relative rounded-2xl border bg-white/[0.03] transition-all duration-200 ${
                  errors.committee
                    ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
                    : committeeFocused
                      ? 'border-[#D4AF37]/80 bg-white/[0.05] shadow-[0_0_26px_rgba(212,175,55,0.22)]'
                      : 'border-white/12 hover:border-white/25'
                }`}
              >
                <label
                  htmlFor="reg-committee"
                  className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                    committeeFocused || preferredCommittee !== ''
                      ? 'top-2 text-[11px] font-medium tracking-wide text-[#F3E5AB]'
                      : 'top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]'
                  }`}
                >
                  Committee Preference
                </label>

                <select
                  id="reg-committee"
                  value={preferredCommittee}
                  onFocus={() => setCommitteeFocused(true)}
                  onBlur={() => setCommitteeFocused(false)}
                  onChange={(e) => {
                    onPreferredCommitteeChange(e.target.value as Committee['id'] | '');
                    if (errors.committee) setErrors((prev) => ({ ...prev, committee: undefined }));
                  }}
                  aria-invalid={Boolean(errors.committee)}
                  className="w-full cursor-pointer appearance-none bg-transparent px-4 pt-6 pb-2.5 pr-10 text-sm text-[#F8FAFC] outline-none"
                >
                  <option value="" className="bg-[#080C18] text-[#94A3B8]">
                    {committeeFocused ? 'Select a council...' : ''}
                  </option>
                  {COMMITTEES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#080C18] text-[#F8FAFC]">
                      {c.acronym} — {c.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                />
              </div>
              {errors.committee && (
                <p role="alert" className="mt-1.5 pl-1 text-xs text-rose-300">
                  {errors.committee}
                </p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {submittedNotice && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#F3E5AB]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <span>{submittedNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative flex min-h-[50px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#050505] shadow-[0_14px_36px_-10px_rgba(212,175,55,0.5)] transition-all duration-200 hover:shadow-[0_18px_44px_-8px_rgba(212,175,55,0.68)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {/* Sweeping light shimmer effect */}
              <span
                aria-hidden="true"
                className="shimmer-sweep-bar pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                <span>Submit</span>
                <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
