import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';

type PageLink = { path: string; label: string };
type Theme = 'light' | 'dark';
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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
      return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [fontStep, setFontStep] = useState(2);
  const fontScalePercentages = [87.5, 100, 112.5, 125, 137.5] as const;

  const changeTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  };

  const changeFontStep = (nextStep: number) => {
    if (nextStep < 0 || nextStep >= fontScalePercentages.length) return;
    document.documentElement.style.fontSize = `${fontScalePercentages[nextStep]}%`;
    setFontStep(nextStep);
  };

  const isDark = theme === 'dark';
  return (
    <div className="utility-bar" data-testid="utility-bar">
      <div className="utility-bar-inner page-wrap">
        <div className="utility-tools" role="group" aria-label="إعدادات العرض">
          <button
            type="button"
            className="utility-button theme-toggle"
            onClick={changeTheme}
            aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun size={18} strokeWidth={1.75} aria-hidden="true" /> : <Moon size={18} strokeWidth={1.75} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="utility-button"
            onClick={() => changeFontStep(fontStep - 1)}
            aria-label="تصغير الخط"
            disabled={fontStep === 0}
            data-testid="button-font-decrease"
          >A−</button>
          <button
            type="button"
            className="utility-button"
            onClick={() => changeFontStep(2)}
            aria-label="حجم الخط الافتراضي"
            disabled={fontStep === 2}
            data-testid="button-font-reset"
          >A</button>
          <button
            type="button"
            className="utility-button"
            onClick={() => changeFontStep(fontStep + 1)}
            aria-label="تكبير الخط"
            disabled={fontStep === 4}
            data-testid="button-font-increase"
          >A+</button>
        </div>
      </div>
    </div>
  );
}

export function Navbar({ onMenuOpenChange }: { onMenuOpenChange?: (open: boolean) => void }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const previousLocation = useRef(location);
  const wasOpen = useRef(false);

  useEffect(() => {
    onMenuOpenChange?.(open);
  }, [open, onMenuOpenChange]);

  useEffect(() => {
    if (previousLocation.current !== location) {
      previousLocation.current = location;
      if (open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
  }, [location, open]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) menuButtonRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="site-navbar" data-testid="site-header">
      <div className="navbar-inner page-wrap flex items-center justify-between gap-4">
        <Link href="/" aria-label="حِرز - الرئيسية" data-testid="link-brand-home" className="brand-link">
          <img src="/assets/logo/heraz-logo-horizontal-white-turquoise.png" alt="شعار حِرز" width="143" height="56" className="navbar-logo" />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="desktop-navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={location === item.path || (item.path === '/protect' && location.startsWith('/protect/')) ? 'page' : undefined}
              data-testid={`nav-${item.path === '/' ? 'home' : item.path.slice(1)}`}
              className="nav-link"
            >{item.label}</Link>
          ))}
          <Link href="/kids" aria-current={location === '/kids' ? 'page' : undefined} data-testid="nav-kids" className="nav-link">عالم حرز</Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          data-testid="button-mobile-menu"
          aria-haspopup="true"
        >
          {open ? <X size={22} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav ref={menuRef} id="mobile-navigation" aria-label="التنقل الرئيسي" className="mobile-menu" data-testid="mobile-navigation">
          {[...navItems, { path: '/kids', label: 'عالم حرز' }].map((item) => (
          <Link
              key={item.path}
              href={item.path}
              aria-current={location === item.path || (item.path === '/protect' && location.startsWith('/protect/')) ? 'page' : undefined}
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

export function Footer() {
  return (
    <footer className="site-footer" data-testid="site-footer">
      <div className="site-footer-inner page-wrap">
        <div className="site-footer-brand">
          <img
            src="/assets/logo/heraz-logo-horizontal-white-turquoise.png"
            alt="شعار حِرز"
            width="246"
            height="96"
            className="site-footer-logo"
          />
          <p className="privacy-badge" data-testid="text-data-privacy">
            <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" />
        <span>لا نجمع أي بيانات من زوارنا.</span>
          </p>
        </div>
        <p className="site-footer-description" data-testid="text-footer-description">
          منصة توعوية عربية تساعد أولياء الأمور على فهم مخاطر الاستنساخ الرقمي لصور الأطفال بالذكاء الاصطناعي، وتبنّي ممارسات وقائية.
        </p>
        <nav aria-label="روابط إضافية" className="footer-links">
          <Link href="/about" data-testid="footer-about">عن حرز</Link>
          <Link href="/understand#understand-sources-title" data-testid="footer-sources">المصادر</Link>
          <Link href="/privacy" data-testid="footer-privacy">الخصوصية</Link>
        </nav>
      </div>
      <div className="site-footer-bottom">
        <p data-testid="text-footer-copyright">© 2026 منصة حِرز.</p>
      </div>
    </footer>
  );
}

export function EmergencyButton({ hidden = false }: { hidden?: boolean }) {
  if (hidden) return null;
  return (
    <Link href="/protect/help" className="emergency-button" aria-label="طفلي تعرّض لمشكلة؟" data-testid="emergency-help">
      <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" />
      <span>طفلي تعرّض لمشكلة؟</span>
    </Link>
  );
}

type HeaderProps = {
  title: string;
  description: string;
  kids?: boolean;
  eyebrow?: string;
  breadcrumbHome?: string;
  breadcrumbSeparator?: string;
};
export function PageHeader({
  title,
  description,
  kids = false,
  eyebrow,
  breadcrumbHome = 'الرئيسية',
  breadcrumbSeparator = '‹',
}: HeaderProps) {
  return (
    <header className="page-heading-band mb-9" data-testid="page-header">
      <nav aria-label="مسار الصفحة" className="mb-4 flex items-center gap-2 text-sm text-[var(--navy)]/75">
        <Link href="/" data-testid="breadcrumb-home" className="underline-offset-4 hover:underline">{breadcrumbHome}</Link>
        <span aria-hidden="true">{breadcrumbSeparator}</span>
        <span aria-current="page" data-testid="breadcrumb-current">{title}</span>
      </nav>
      <p className="page-eyebrow" data-testid="text-page-eyebrow">{eyebrow ?? title}</p>
      <h1 className={`section-title mb-4 ${kids ? 'kids-accent' : ''}`} data-testid="heading-page-title">{title}</h1>
      {description.trim() && (
        <p className="max-w-[68ch] text-[1.0625rem] leading-8 text-[var(--navy)]/80 sm:text-lg" data-testid="text-page-description">{description}</p>
      )}
    </header>
  );
}

type StepProps = { path: string };
export function NextStep({ path }: StepProps) {
  const index = journey.findIndex((page) => page.path === path);
  const next = index >= 0 ? journey[index + 1] : undefined;
  if (!next) return null;
  return (
    <nav aria-label="التنقل بين الصفحات" className="next-page-card page-wrap mt-12 border-t border-[var(--navy-10)] pt-7" data-testid="next-step-navigation">
      <Link href={next.path} data-testid="button-next-page" className="primary-button">
        <span>التالي: {next.label}</span>
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>
    </nav>
  );
}
