'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * TopProgressBar — GitHub/YouTube-style loading bar.
 *
 * Fires on every pathname or searchParams change (client-side navigation).
 * Uses a CSS animation trick: jumps to ~70% quickly, then slowly crawls
 * to ~90%, then completes to 100% on the next render after the route settles.
 */
function ProgressBar() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress]   = useState(0);
  const [visible, setVisible]     = useState(false);
  const crawlTimer  = useRef(null);
  const completeTimer = useRef(null);

  const clear = () => {
    clearInterval(crawlTimer.current);
    clearTimeout(completeTimer.current);
  };

  const start = () => {
    clear();
    setProgress(0);
    setVisible(true);

    // Jump to 20% instantly, then crawl
    requestAnimationFrame(() => {
      setProgress(20);
      let current = 20;
      crawlTimer.current = setInterval(() => {
        // Slow logarithmic crawl — never reaches 100 on its own
        const increment = (100 - current) * 0.08;
        current = Math.min(current + increment, 90);
        setProgress(current);
        if (current >= 90) clearInterval(crawlTimer.current);
      }, 150);
    });
  };

  const complete = () => {
    clear();
    setProgress(100);
    completeTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  // Track previous route to distinguish navigation from initial mount
  const prevRoute = useRef(null);

  useEffect(() => {
    const route = pathname + searchParams.toString();

    if (prevRoute.current === null) {
      prevRoute.current = route;
      return;
    }

    if (prevRoute.current !== route) {
      prevRoute.current = route;
      // Route has settled — complete the bar
      complete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Start the bar whenever a link is clicked (before the route changes)
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only intercept same-origin, non-hash, non-external links
      const isInternal = href.startsWith('/') || href.startsWith(window.location.origin);
      const isHash     = href.startsWith('#');
      if (isInternal && !isHash) start();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={Math.round(progress)}
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        zIndex:     9999,
        height:     '3px',
        width:      `${progress}%`,
        transition: progress === 0
          ? 'none'
          : progress === 100
            ? 'width 0.2s ease-out'
            : 'width 0.15s ease-out',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        boxShadow:  '0 0 8px rgba(99, 102, 241, 0.6)',
        borderRadius: '0 2px 2px 0',
      }}
    >
      {/* Glowing leading edge */}
      <div style={{
        position:        'absolute',
        right:           0,
        top:             '-2px',
        width:           '80px',
        height:          '7px',
        background:      'radial-gradient(ellipse at right, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
        filter:          'blur(3px)',
        borderRadius:    '50%',
        pointerEvents:   'none',
      }} />
    </div>
  );
}

/**
 * TopProgressBar must be wrapped in Suspense because it uses useSearchParams.
 */
export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
