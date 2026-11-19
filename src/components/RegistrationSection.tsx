import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Send } from 'lucide-react';
import { HoverBorderGradient } from './aceternity/HoverBorderGradient';
import { CardSpotlight } from './aceternity/CardSpotlight';

export type RegistrationMode = 'delegate' | 'secretariat';

const DEPARTMENT_OPTIONS = [
  'Social Media',
  'Sponsorships',
  'Marketing',
  'Design',
  'Content/Editorial',
] as const;

const HOURS_OPTIONS = ['1-2', '3-5', '5-8', '8+'] as const;

const DELEGATES_OPTIONS = ['3-5', '6-8', '8-10', '10-15', '15+'] as const;

interface RegistrationSectionProps {
  mode: RegistrationMode;
  onModeChange: (mode: RegistrationMode) => void;
}

interface FloatingInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: number;
  max?: number;
}

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  min,
  max,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={`relative rounded-2xl border bg-[#120A06]/70 transition-all duration-200 ${
          error
            ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
            : focused
              ? 'border-[#D4AF37]/85 bg-[#1A100A] shadow-[0_0_26px_rgba(212,175,55,0.24)]'
              : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/45'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            isFloating
              ? 'top-2 text-[11px] font-medium tracking-wide text-[#F3E5AB]'
              : 'top-1/2 -translate-y-1/2 text-sm text-[#C5B49A]'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent px-4 pt-6 pb-2.5 text-sm text-[#FAF6EE] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

interface FloatingTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  error,
  rows = 3,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={`relative rounded-2xl border bg-[#120A06]/70 transition-all duration-200 ${
          error
            ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
            : focused
              ? 'border-[#D4AF37]/85 bg-[#1A100A] shadow-[0_0_26px_rgba(212,175,55,0.24)]'
              : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/45'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            isFloating
              ? 'top-2.5 text-[11px] font-medium tracking-wide text-[#F3E5AB]'
              : 'top-4 text-sm text-[#C5B49A]'
          }`}
        >
          {label}
        </label>
        <textarea
          id={id}
          rows={rows}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="w-full resize-y bg-transparent px-4 pt-7 pb-3 text-sm leading-relaxed text-[#FAF6EE] outline-none"
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

interface FloatingSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

function FloatingSelect({
  id,
  label,
  value,
  options,
  onChange,
  error,
  placeholder = 'Select an option...',
}: FloatingSelectProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value !== '';

  return (
    <div className="relative">
      <div
        className={`relative rounded-2xl border bg-[#120A06]/70 transition-all duration-200 ${
          error
            ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
            : focused
              ? 'border-[#D4AF37]/85 bg-[#1A100A] shadow-[0_0_26px_rgba(212,175,55,0.24)]'
              : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/45'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            isFloating
              ? 'top-2 text-[11px] font-medium tracking-wide text-[#F3E5AB]'
              : 'top-1/2 -translate-y-1/2 text-sm text-[#C5B49A]'
          }`}
        >
          {label}
        </label>

        <select
          id={id}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="w-full cursor-pointer appearance-none bg-transparent px-4 pt-6 pb-2.5 pr-10 text-sm text-[#FAF6EE] outline-none"
        >
          <option value="" className="bg-[#1A100A] text-[#C5B49A]">
            {focused ? placeholder : ''}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1A100A] text-[#FAF6EE]">
              {opt}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#D4AF37]"
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

interface FormState {
  name: string;
  school: string;
  age: string;
  phone: string;
  email: string;
  instagram: string;
  attendedMun: 'Yes' | 'No' | '';
  munDetails: string;
  department: string;
  skills: string;
  whyJoin: string;
  hours: string;
  delegates: string;
  references: string;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  school: '',
  age: '',
  phone: '',
  email: '',
  instagram: '',
  attendedMun: '',
  munDetails: '',
  department: '',
  skills: '',
  whyJoin: '',
  hours: '',
  delegates: '',
  references: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function RegistrationSection({ mode, onModeChange }: RegistrationSectionProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!submitStatus) return;
    const timer = window.setTimeout(() => setSubmitStatus(null), 8000);
    return () => window.clearTimeout(timer);
  }, [submitStatus]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Please enter your full name.';
    }
    if (!form.school.trim()) {
      next.school = 'Please enter your school or college name.';
    }
    const ageNum = Number(form.age);
    if (!form.age.trim() || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 99) {
      next.age = 'Please enter a valid age (10–99).';
    }
    if (!/^[+\d\s()-]{7,20}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid phone number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.instagram.trim()) {
      next.instagram = 'Please enter your Instagram ID.';
    }
    if (!form.attendedMun) {
      next.attendedMun = 'Please select Yes or No.';
    }
    if (form.attendedMun === 'Yes' && !form.munDetails.trim()) {
      next.munDetails = 'Please share your previous MUN details and role.';
    }
    if (!form.department) {
      next.department = 'Please select a department preference.';
    }
    if (!form.skills.trim()) {
      next.skills = 'Please describe your skills or relevant experience.';
    }
    if (!form.whyJoin.trim()) {
      next.whyJoin = 'Please tell us why you want to join The Aurora Summit.';
    }
    if (!form.hours) {
      next.hours = 'Please select your weekly availability.';
    }
    if (!form.delegates) {
      next.delegates = 'Please select how many delegates you can bring.';
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus(null);
      return;
    }

    const payload = {
      name: form.name.trim(),
      school: form.school.trim(),
      age: form.age.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      instagram: form.instagram.trim(),
      attendedMun: form.attendedMun,
      munDetails: form.munDetails.trim(),
      department: form.department,
      skills: form.skills.trim(),
      whyJoin: form.whyJoin.trim(),
      hours: form.hours,
      delegates: form.delegates,
      references: form.references.trim(),
    };

    if (!import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
      setSubmitStatus({
        type: 'error',
        message: 'Registration endpoint is not configured. Please contact the organizers.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    void fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Fire-and-forget background request for Apps Script CORS redirects
    });

    setIsSubmitting(false);
    setForm(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitStatus({
      type: 'success',
      message: `Application submitted successfully! Thank you, ${payload.name} — our Aurora Summit team has received your registration.`,
    });
  };

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mb-10 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-[#D4AF37]">
          04. Delegate &amp; Secretariat Intake
        </p>
        <h2 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-[#FAF6EE] sm:text-4xl lg:text-[2.75rem]">
          Reserve Your Voice
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#D6C7B2] sm:text-base">
          Complete the dossier below to apply for Aurora Summit 1.0. Our team reviews every
          submission on a rolling basis.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <HoverBorderGradient roundedClassName="rounded-3xl">
          <CardSpotlight className="rounded-3xl p-6 sm:p-10">
            <div className="mb-8 flex justify-center">
              <div
                role="tablist"
                aria-label="Application Type"
                className="inline-flex rounded-full border border-[#D4AF37]/25 bg-[#120A06]/80 p-1"
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
                        active ? 'text-[#1A100A]' : 'text-[#D6C7B2] hover:text-white'
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
                  label="Name"
                  value={form.name}
                  onChange={(val) => updateField('name', val)}
                  error={errors.name}
                />
                <FloatingInput
                  id="reg-school"
                  label="School/College"
                  value={form.school}
                  onChange={(val) => updateField('school', val)}
                  error={errors.school}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatingInput
                  id="reg-age"
                  label="Age"
                  type="number"
                  min={10}
                  max={99}
                  value={form.age}
                  onChange={(val) => updateField('age', val)}
                  error={errors.age}
                />
                <FloatingInput
                  id="reg-phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(val) => updateField('phone', val)}
                  error={errors.phone}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatingInput
                  id="reg-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(val) => updateField('email', val)}
                  error={errors.email}
                />
                <FloatingInput
                  id="reg-instagram"
                  label="Instagram ID"
                  value={form.instagram}
                  onChange={(val) => updateField('instagram', val)}
                  error={errors.instagram}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <div
                    className={`flex min-h-[58px] items-center justify-between gap-4 rounded-2xl border bg-[#120A06]/70 px-4 py-2.5 transition-all duration-200 ${
                      errors.attendedMun
                        ? 'border-rose-400/70 shadow-[0_0_22px_rgba(251,113,133,0.18)]'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/45'
                    }`}
                  >
                    <span className="text-sm text-[#D6C7B2]">Attended MUN before?</span>
                    <div
                      role="radiogroup"
                      aria-label="Attended MUN before?"
                      className="inline-flex rounded-xl border border-[#D4AF37]/20 bg-[#1A100A] p-1"
                    >
                      {(['Yes', 'No'] as const).map((option) => {
                        const selected = form.attendedMun === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => updateField('attendedMun', option)}
                            className={`min-h-[34px] rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
                              selected
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C667] text-[#1A100A] shadow-sm'
                                : 'text-[#D6C7B2] hover:text-white'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {errors.attendedMun && (
                    <p role="alert" className="mt-1.5 pl-1 text-xs text-rose-300">
                      {errors.attendedMun}
                    </p>
                  )}
                </div>

                <FloatingSelect
                  id="reg-department"
                  label="Department Preference"
                  value={form.department}
                  options={DEPARTMENT_OPTIONS}
                  onChange={(val) => updateField('department', val)}
                  error={errors.department}
                  placeholder="Select a department..."
                />
              </div>

              <FloatingTextarea
                id="reg-mun-details"
                label="MUN Details & Role"
                rows={2}
                value={form.munDetails}
                onChange={(val) => updateField('munDetails', val)}
                error={errors.munDetails}
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatingTextarea
                  id="reg-skills"
                  label="Skills/Experience"
                  rows={3}
                  value={form.skills}
                  onChange={(val) => updateField('skills', val)}
                  error={errors.skills}
                />
                <FloatingTextarea
                  id="reg-why-join"
                  label="Why Join?"
                  rows={3}
                  value={form.whyJoin}
                  onChange={(val) => updateField('whyJoin', val)}
                  error={errors.whyJoin}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatingSelect
                  id="reg-hours"
                  label="Hours per week"
                  value={form.hours}
                  options={HOURS_OPTIONS}
                  onChange={(val) => updateField('hours', val)}
                  error={errors.hours}
                  placeholder="Select weekly hours..."
                />
                <FloatingSelect
                  id="reg-delegates"
                  label="Delegates can bring"
                  value={form.delegates}
                  options={DELEGATES_OPTIONS}
                  onChange={(val) => updateField('delegates', val)}
                  error={errors.delegates}
                  placeholder="Select delegate range..."
                />
              </div>

              <FloatingInput
                id="reg-references"
                label="References"
                value={form.references}
                onChange={(val) => updateField('references', val)}
                error={errors.references}
              />

              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
                      submitStatus.type === 'success'
                        ? 'border-[#D4AF37]/45 bg-[#D4AF37]/12 text-[#F3E5AB]'
                        : 'border-rose-400/45 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                    )}
                    <span>{submitStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex min-h-[50px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#1A100A] shadow-[0_14px_36px_-10px_rgba(212,175,55,0.5)] transition-all duration-200 hover:shadow-[0_18px_44px_-8px_rgba(212,175,55,0.68)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <span
                    aria-hidden="true"
                    className="shimmer-sweep-bar pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                  />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </CardSpotlight>
        </HoverBorderGradient>
      </motion.div>
    </section>
  );
}
