import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronUp } from 'lucide-react';

export default function BackToTopButton() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const isKidsPage = location === '/kids';

  useEffect(() => {
    if (isKidsPage) {
      setVisible(false);
      return;
    }

    const scrollContainer = document.querySelector<HTMLElement>('[data-testid="page-scroll-container"]');
    if (!scrollContainer) {
      setVisible(false);
      return;
    }

    const updateVisibility = () => setVisible(scrollContainer.scrollTop > 400);
    updateVisibility();
    scrollContainer.addEventListener('scroll', updateVisibility, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', updateVisibility);
  }, [isKidsPage, location]);

  if (isKidsPage || !visible) return null;

  const scrollToTop = () => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) root.style.scrollBehavior = 'auto';
    document.querySelector<HTMLElement>('[data-testid="page-scroll-container"]')?.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
    if (reducedMotion) root.style.scrollBehavior = previousScrollBehavior;
  };

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label="العودة إلى أعلى الصفحة"
      onClick={scrollToTop}
      data-testid="button-back-to-top"
    >
      <ChevronUp size={23} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}
