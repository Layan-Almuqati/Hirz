import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/home';
import BeforeYouPostPage from '@/pages/before-you-post';
import HelpPage from '@/pages/help';
import PlaceholderPage from '@/pages/placeholder';
import RisksPage from '@/pages/risks';
import ProtectPage from '@/pages/protect';
import QuizPage from '@/pages/quiz';
import { EmergencyButton, Footer, Navbar, NextStep, UtilityBar } from '@/components/heraz/layout';
import AboutPage from '@/pages/about';
import PrivacyPage from '@/pages/privacy';
import BackToTopButton from '@/components/heraz/back-to-top';

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const routePath = location.split(/[?#]/, 1)[0] || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const updateMenuOpen = useCallback((value: boolean) => setMenuOpen(value), []);
  const onHelpRoute = routePath === '/protect/help' || routePath.startsWith('/protect/help/');
  return (
    <div dir="rtl" className="site-shell min-h-[100dvh]">
      <a className="skip-link" href="#main-content" data-testid="link-skip-content">تخطَّ إلى المحتوى</a>
      <div className="page-scroll" data-testid="page-scroll-container">
        <UtilityBar />
        <Navbar onMenuOpenChange={updateMenuOpen} />
        <div className="shell-content">
          {children}
          <NextStep path={routePath} />
          <Footer />
        </div>
      </div>
      <div className="emergency-dock">
        <BackToTopButton />
        <EmergencyButton hidden={onHelpRoute || menuOpen} />
      </div>
    </div>
  );
}

const pageTitles: Record<string, string> = {
  '/': 'الرئيسية',
  '/understand': 'افهم',
  '/risks': 'المخاطر',
  '/before-you-post': 'قبل أن تنشر',
  '/protect': 'احمِ',
  '/protect/help': 'ماذا حدث؟',
  '/laws': 'التشريعات',
  '/quiz': 'اختبر وعيك',
  '/kids': 'عالم حرز',
  '/about': 'عن حِرز',
  '/privacy': 'سياسة الخصوصية',
};

function RouteMetadataAndScroll() {
  const [location] = useLocation();
  const routePath = location.split(/[?#]/, 1)[0] || '/';
  const isPopState = useRef(false);
  const priorLocation = useRef(location);

  useEffect(() => {
    const onPopState = () => { isPopState.current = true; };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (priorLocation.current === location) {
      isPopState.current = false;
      return;
    }
    priorLocation.current = location;
    const isBackNavigation = isPopState.current;
    isPopState.current = false;
    if (!isBackNavigation && !location.includes('#')) {
      document.querySelector<HTMLElement>('[data-testid="page-scroll-container"]')?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [location]);

  useEffect(() => {
    const path = routePath;
    const name = pageTitles[path] ?? (path.startsWith('/protect/help/') ? 'المساعدة' : 'الصفحة غير موجودة');
    const title = `${name} — حِرز`;
    const main = document.querySelector('main');
    const description = main?.querySelector('p')?.textContent?.trim() ||
      (path === '/' ? document.querySelector('meta[name="description"]')?.getAttribute('content') : '') ||
      'منصة حِرز للتوعية بالهوية الرقمية للأطفال.';
    document.title = title;
    const setMeta = (selector: string, value: string) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      if (element) element.content = value;
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="theme-color"]', '#1D2254');
  }, [location, routePath]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.shell-content main section, .shell-content main [data-reveal-section]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    blocks.forEach((block) => {
      block.classList.add('reveal-section');
      observer.observe(block);
    });
    return () => observer.disconnect();
  }, [location]);

  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <RouteMetadataAndScroll />
      <Shell>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/understand"><PlaceholderPage pageKey="understand" /></Route>
          <Route path="/risks" component={RisksPage} />
          <Route path="/before-you-post" component={BeforeYouPostPage} />
          <Route path="/protect/help" component={HelpPage} />
          <Route path="/protect" component={ProtectPage} />
          <Route path="/laws"><PlaceholderPage pageKey="laws" /></Route>
          <Route path="/quiz" component={QuizPage} />
          <Route path="/kids"><PlaceholderPage pageKey="kids" /></Route>
          <Route>
            <main id="main-content" tabIndex={-1} className="page-wrap not-found-main py-20">
              <NotFound />
              <Link href="/" data-testid="link-not-found-home" className="primary-button mt-6">العودة إلى الرئيسية</Link>
            </main>
          </Route>
        </Switch>
      </Shell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
