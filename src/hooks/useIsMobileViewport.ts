import { useEffect, useState } from 'react';

/**
 * Tracks mobile viewport (< 768px) via matchMedia so changes fire only when
 * crossing the breakpoint, leaving desktop (>= 768px) untouched.
 */
export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isMobile;
}
