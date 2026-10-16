import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Menu, X } from 'lucide-react';

type PageLink = { path: string; label: string };

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

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--navy-10)] bg-white/[.96] backdrop-blur-sm" data-testid="site-header">
      <div className="page-wrap flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="حِرز - الرئيسية" data-testid="link-brand-home" className="flex shrink-0 items-center rounded-sm p-2">
          <img src="/assets/logo/heraz-logo-horizontal-color.png" alt="شعار حِرز" className="h-auto w-[132px] sm:w-[160px]" />
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
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--navy-10)] bg-white lg:hidden"
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

export function Footer({ pages }: { pages: PageLink[] }) {
  return (
    <footer className="bg-[var(--navy)] text-white" data-testid="site-footer">
      <div className="page-wrap grid gap-10 py-12 md:grid-cols-[.8fr_1.2fr] md:gap-16 md:py-16">
        <div>
          <Link href="/" aria-label="حِرز - الرئيسية" data-testid="footer-brand-home" className="inline-flex rounded-sm p-2">
            <img src="/assets/logo/heraz-logo-horizontal-white-turquoise.png" alt="شعار حِرز" className="w-[170px]" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-8 text-white/80" data-testid="text-data-privacy">لا نجمع أي بيانات من زوارنا.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <nav aria-label="روابط سريعة" className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-1">
            <h2 className="col-span-2 mb-1 font-bold text-[var(--turquoise)] sm:col-span-1">روابط سريعة</h2>
            {pages.map((page) => (
              <Link key={page.path} href={page.path} data-testid={`footer-${page.path === '/' ? 'home' : page.path.slice(1)}`} className="min-h-11 py-1 text-sm text-white/85 underline-offset-4 hover:text-white hover:underline">
                {page.label}
              </Link>
            ))}
          </nav>
          <div className="text-sm leading-8 text-white/85">
            <p data-testid="text-project-university">مشروع تخرج - جامعة الأميرة نورة بنت عبدالرحمن</p>
            <p data-testid="text-project-college">كلية العلوم الإنسانية والاجتماعية - قسم الصحافة والإعلام</p>
            <p data-testid="text-project-advisor">إشراف: د. نوال المنيف</p>
            <p data-testid="text-project-team">فريق العمل: ليان المقاطي، أفنان الشميمري، آية الغامدي، دانا رحالي، ريما عباس، ريناد الألمعي، غادة العنقودي، جواهر المنهالي</p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--teal)] px-5 py-2 text-center text-sm font-semibold text-[var(--navy)]" data-testid="text-hijri-year">1448 هـ / 2027 م</div>
    </footer>
  );
}

type HeaderProps = { title: string; description: string; kids?: boolean };
export function PageHeader({ title, description, kids = false }: HeaderProps) {
  return (
    <div className="mb-9" data-testid="page-header">
      <nav aria-label="مسار الصفحة" className="mb-4 flex items-center gap-2 text-sm text-[var(--navy)]/75">
        <Link href="/" data-testid="breadcrumb-home" className="underline-offset-4 hover:underline">الرئيسية</Link>
        <span aria-hidden="true">‹</span>
        <span aria-current="page" data-testid="breadcrumb-current">{title}</span>
      </nav>
      <h1 className={`section-title mb-4 ${kids ? 'kids-accent' : ''}`} data-testid="heading-page-title">{title}</h1>
      <p className="max-w-[65ch] text-base leading-8 text-[var(--navy)] sm:text-lg" data-testid="text-page-description">{description}</p>
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
