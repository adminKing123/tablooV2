'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * TopProgressBar — GitHub/YouTube-style loading bar.
 *
 * Fires on client-side navigation. Skips same-page links entirely.
 * Auto-cancels after 10 s in case navigation is aborted.
 */
function ProgressBar() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);

  const crawlTimer   = useRef(null);
  const doneTimer    = useRef(null);
  const cancelTimer  = useRef(null);
  const isStarted    = useRef(false);

  // ── helpers ──────────────────────────────────────────────────────────────

  const clearAll = () => {
    clearInterval(crawlTimer.current);
    clearTimeout(doneTimer.current);
    clearTimeout(cancelTimer.current);
  };

  const start = () => {
    clearAll();
    isStarted.current = true;
    setProgress(0);
    setVisible(true);

    // Jump to 15 % immediately, then crawl slowly toward 90 %
    requestAnimationFrame(() => {
      setProgress(15);
      let current = 15;
      crawlTimer.current = setInterval(() => {
        const step = (90 - current) * 0.1;
        current = Math.min(current + step, 89.9);
        setProgress(current);
        if (current >= 89.9) clearInterval(crawlTimer.current);
      }, 200);
    });

    // Safety valve — auto-cancel if the route never settles (e.g. user pressed Escape)
    cancelTimer.current = setTimeout(cancel, 10_000);
  };

  const complete = () => {
    if (!isStarted.current) return;
    clearAll();
    isStarted.current = false;
    setProgress(100);
    doneTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);
  };

  const cancel = () => {
    clearAll();
    isStarted.current = false;
    setVisible(false);
    setProgress(0);
  };

  // ── complete when the route actually changes ──────────────────────────────

  const prevRoute = useRef(null);

  useEffect(() => {
    const route = pathname + searchParams.toString();

    if (prevRoute.current === null) {
      // First render — just record the current route, don't complete
      prevRoute.current = route;
      return;
    }

    if (prevRoute.current !== route) {
      prevRoute.current = route;
      complete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // ── start on link click — but NOT for same-page links ────────────────────

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore non-navigation links
      if (href.startsWith('#'))       return;
      if (href.startsWith('mailto:')) return;
      if (href.startsWith('tel:'))    return;
      if (anchor.target === '_blank') return;
      if (anchor.hasAttribute('download')) return;

      // Resolve to absolute to compare origins
      let target;
      try { target = new URL(href, window.location.href); } catch { return; }

      // Ignore cross-origin
      if (target.origin !== window.location.origin) return;

      // *** Key fix: ignore links to the exact same page ***
      const currentPath = window.location.pathname + window.location.search;
      const targetPath  = target.pathname + target.search;
      if (currentPath === targetPath) return;

      start();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── render ────────────────────────────────────────────────────────────────

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={Math.round(progress)}
      style={{
        position:     'fixed',
        top:          0,
        left:         0,
        zIndex:       9999,
        height:       '3px',
        width:        `${progress}%`,
        transition:   progress === 0
          ? 'none'
          : progress === 100
            ? 'width 0.2s ease-out'
            : 'width 0.22s ease-out',
        background:   'linear-gradient(90deg, #6366f1, #8b5cf6)',
        boxShadow:    '0 0 8px rgba(99, 102, 241, 0.6)',
        borderRadius: '0 2px 2px 0',
      }}
    >
      {/* Glowing leading edge */}
      <div style={{
        position:      'absolute',
        right:         0,
        top:           '-2px',
        width:         '80px',
        height:        '7px',
        background:    'radial-gradient(ellipse at right, rgba(139,92,246,0.6) 0%, transparent 70%)',
        filter:        'blur(3px)',
        borderRadius:  '50%',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}

