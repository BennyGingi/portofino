'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Analytics } from '@/lib/analytics';

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'education', 'contact'];

export default function AnalyticsTracker() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    Analytics.incrementVisits();
  }, []);

  useEffect(() => {
    if (resolvedTheme) Analytics.trackTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            Analytics.trackSection(id.charAt(0).toUpperCase() + id.slice(1));
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
