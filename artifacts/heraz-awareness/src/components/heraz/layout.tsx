import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';

type PageLink = { path: string; label: string };
type Theme = 'light' | 'dark';
const fontScalePercentages = [87.5, 100, 112.5, 125, 137.5] as const;

const navItems: PageLink[] = [
  { path: '/', label: 'الرئيسية' },
  { path: '/understand', label: 'افهم' },
  { path: '/risks', label: 'المخاطر' },
  { path: '/before-you-post', label: 'قبل أن تنشر' },
  { path: '/protect', label: 'احمِ' },
  { path: '/laws', label: 'التشريعات' },
  { path: '/quiz', label: 'اختبر وعيك' },
];

const journey = [
  { path: '/understand', label: 'افهم الاستنساخ الرقمي' },
  { path: '/risks', label: 'المخاطر المستقبلية' },
  { path: '/before-you-post', label: 'قبل أن تنشر' },
  { path: '/protect', label: 'احمِ هوية طفلك' },
  { path: '/laws', label: 'التشريعات' },
  { path: '/quiz', label: 'اختبر وعيك' },
  { path: '/kids', label: 'عالم حرز' },
];

export function UtilityBar() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );
  const [fontStep, setFontStep] = useState(() => {
    if (typeof document === 'undefined') return 2;
    const parsed = Number(document.documentElement.dataset.fontStep);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 4 ? parsed : 2;
  });

  const changeTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('heraz-theme', nextTheme);
    } catch {
      // The current page still updates if browser storage is unavailable.
    }
  };

  const changeFontStep = (nextStep: number) => {
    if (nextStep < 0 || nextStep > 4 || nextStep === fontStep) return;
    document.documentElement.dataset.fontStep = String(nextStep);
    document.documentElement.style.fontSize = `${fontScalePercentages[nextStep]}%`;
    setFontStep(nextStep);
    try {
      window.localStorage.setItem('heraz-font-step', String(nextStep));
    } catch {
      // The current page still updates if browser storage is unavailable.
    }
  };

  const isDark = theme === 'dark';
  return (
    <div className="utility-bar" data-testid="utility-bar">
      <div className="utility-bar-inner page-wrap">
        <div className="utility-tools" role="group">
          <div className="utility-theme-tool">
            <button
              type="button"
              className="utility-button"
              onClick={changeTheme}
              aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>
            <span className="utility-theme-label" aria-hidden="true">{isDark ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
          </div>
          <button
            type="button"
            className="utility-button utility-letter"
            onClick={() => changeFontStep(fontStep - 1)}
            aria-label="تصغير الخط"
            aria-disabled={fontStep === 0}
            data-testid="button-font-decrease"
          >A-</button>
          <button
            type="button"
            className="utility-button utility-letter"
            onClick={() => changeFontStep(2)}
            aria-label="حجم الخط الافتراضي"
            data-testid="button-font-reset"
          >A</button>
          <button
            type="button"
            className="utility-button utility-letter"
            onClick={() => changeFontStep(fontStep + 1)}
            aria-label="تكبير الخط"
            aria-disabled={fontStep === 4}
            data-testid="button-font-increase"
          >A+</button>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location === '/';

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <header className={`site-navbar sticky top-0 z-50 ${isHome ? 'home-navbar' : 'inner-navbar'} ${isScrolled ? 'is-scrolled' : ''}`} data-testid="site-header">
      <div className="navbar-inner page-wrap flex items-center justify-between gap-4">
        <Link href="/" aria-label="حِرز - الرئيسية" data-testid="link-brand-home" className="flex shrink-0 items-center rounded-sm">
          <img src="/assets/logo/heraz-logo-horizontal-white-turquoise.png" alt="شعار حِرز" className="navbar-logo" />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-3 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={location === item.path ? 'page' : undefined}
              data-testid={`nav-${item.path === '/' ? 'home' : item.path.slice(1)}`}
              className="nav-link"
            >{item.label}</Link>
          ))}
        </nav>
        <Link href="/kids" data-testid="nav-kids-world" className="kids-button hidden min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-bold no-underline transition-transform hover:-translate-y-0.5 md:inline-flex">
          عالم حرز
        </Link>
        <button
          type="button"
          className="menu-toggle grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden"
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="التنقل الرئيسي" className="mobile-menu lg:hidden" data-testid="mobile-navigation">
          {[...navItems, { path: '/kids', label: 'عالم حرز' }].map((item) => (
          <Link
              key={item.path}
              href={item.path}
              aria-current={location === item.path ? 'page' : undefined}
              data-testid={`mobile-nav-${item.path === '/' ? 'home' : item.path.slice(1)}`}
              className={item.path === '/kids' ? 'kids-accent font-bold' : ''}
              onClick={() => setOpen(false)}
            >{item.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer({ pages, aboutLink }: { pages: PageLink[]; aboutLink?: PageLink }) {
  const usefulLinks = pages.filter((page) => page.path !== '/');
  const sourcesHref = `${import.meta.env.BASE_URL}understand#understand-sources-title`;

  return (
    <footer className="site-footer" data-testid="site-footer">
      <div className="site-footer-inner page-wrap">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link href="/" aria-label="حِرز - الرئيسية" data-testid="footer-brand-home" className="site-footer-logo-link">
              <img src="/assets/logo/heraz-logo-horizontal-white-turquoise.png" alt="شعار حِرز" className="site-footer-logo" />
            </Link>
            <p className="privacy-badge" data-testid="text-data-privacy">
              <ShieldCheck size={20} strokeWidth={1.75} className="shrink-0 text-[var(--turquoise)]" aria-hidden="true" />
              <span>لا نجمع أي بيانات من زوارنا.</span>
            </p>
          </div>
          <p className="site-footer-description" data-testid="text-footer-description">
            منصة توعوية عربية تساعد أولياء الأمور على فهم مخاطر الاستنساخ الرقمي لصور الأطفال بالذكاء الاصطناعي، وتبنّي ممارسات وقائية.
          </p>
        </div>

        <div className="site-footer-link-columns">
          <nav aria-label="روابط تهمك" className="site-footer-column" data-testid="footer-useful-links">
            <h2 className="site-footer-heading">روابط تهمك</h2>
            <span className="site-footer-heading-rule" aria-hidden="true" />
            <div className="site-footer-link-list">
              {usefulLinks.map((page) => (
                <Link key={page.path} href={page.path} data-testid={`footer-${page.path.slice(1)}`} className="site-footer-link">
                  {page.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="نظرة عامة" className="site-footer-column" data-testid="footer-overview-links">
            <h2 className="site-footer-heading">نظرة عامة</h2>
            <span className="site-footer-heading-rule" aria-hidden="true" />
            <div className="site-footer-link-list">
              {aboutLink && (
                <Link href={aboutLink.path} data-testid="footer-about" className="site-footer-link">
                  {aboutLink.label}
                </Link>
              )}
              <Link href="/privacy" data-testid="footer-privacy" className="site-footer-link">
                سياسة الخصوصية
              </Link>
              <a href={sourcesHref} data-testid="footer-sources" className="site-footer-link">
                المصادر
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p data-testid="text-footer-copyright">© 2026 منصة حِرز</p>
      </div>
    </footer>
  );
}

type HeaderProps = {
  title: string;
  description: string;
  kids?: boolean;
  breadcrumbHome?: string;
  breadcrumbSeparator?: string;
};
export function PageHeader({
  title,
  description,
  kids = false,
  breadcrumbHome = 'الرئيسية',
  breadcrumbSeparator = '‹',
}: HeaderProps) {
  return (
    <div className="mb-9" data-testid="page-header">
      <nav aria-label="مسار الصفحة" className="mb-4 flex items-center gap-2 text-sm text-[var(--navy)]/75">
        <Link href="/" data-testid="breadcrumb-home" className="underline-offset-4 hover:underline">{breadcrumbHome}</Link>
        <span aria-hidden="true">{breadcrumbSeparator}</span>
        <span aria-current="page" data-testid="breadcrumb-current">{title}</span>
      </nav>
      <h1 className={`section-title mb-4 ${kids ? 'kids-accent' : ''}`} data-testid="heading-page-title">{title}</h1>
      <p className="max-w-[65ch] text-[1.0625rem] leading-8 text-[var(--navy)]/80 sm:text-lg" data-testid="text-page-description">{description}</p>
    </div>
  );
}

type StepProps = { path: string };
export function NextStep({ path }: StepProps) {
  const index = journey.findIndex((page) => page.path === path);
  const currentIndex = index < 0 ? 0 : index;
  const previous = currentIndex === 0 ? { path: '/', label: 'الرئيسية' } : journey[currentIndex - 1];
  const next = journey[(currentIndex + 1) % journey.length];
  return (
    <nav aria-label="التنقل بين الصفحات" className="mt-12 flex flex-col justify-between gap-4 border-t border-[var(--navy-10)] pt-7 sm:flex-row sm:items-center" data-testid="next-step-navigation">
      <Link href={previous.path} data-testid="button-previous-page" className="secondary-button">
        <ArrowLeft size={18} aria-hidden="true" />
        <span>السابق: {previous.label}</span>
      </Link>
      <Link href={next.path} data-testid="button-next-page" className="primary-button">
        <span>التالي: {next.label}</span>
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>
    </nav>
  );
}
