import { Link } from 'wouter';
import { ArrowLeft, Check, ClipboardCheck } from 'lucide-react';
import { stats } from '@/data/stats';

const journeyCards = [
  {
    n: '1', title: 'افهم الاستنساخ الرقمي', path: '/understand',
    description: 'شرح مبسّط للمفهوم وكيف يحدث تقنيًا مع أمثلة تقرّب الفكرة.',
    icon: 'ai-chip',
  },
  {
    n: '2', title: 'المخاطر المستقبلية', path: '/risks',
    description: 'الأثر بعيد المدى لاستخدام صور الأطفال وبياناتهم في المحتوى المزيّف وانتحال الهوية.',
    icon: 'photos',
  },
  {
    n: '3', title: 'قبل أن تنشر', path: '/before-you-post',
    description: 'أسئلة احترازية سريعة تراجعها قبل نشر أي صورة أو معلومة.',
    icon: 'shield-check',
  },
  {
    n: '4', title: 'احمِ هوية طفلك', path: '/protect',
    description: 'الحلول والإجراءات الوقائية، وضبط إعدادات الخصوصية، وخطوات التعامل مع الاستخدام غير المصرّح به.',
    icon: 'child-protected',
  },
  {
    n: '5', title: 'التشريعات', path: '/laws',
    description: 'الأنظمة والحقوق المرتبطة بحماية بيانات الأطفال.',
    icon: 'hands-heart',
  },
  {
    n: '6', title: 'اختبر وعيك', path: '/quiz',
    description: 'اختبار تفاعلي يقيس فهمك ويقدّم تغذية راجعة فورية.',
    icon: 'quiz',
  },
];

function IdentityIcon({ icon, label }: { icon: string; label: string }) {
  if (icon === 'quiz') {
    return (
      <span className="icon-tile" aria-hidden="true">
        <ClipboardCheck size={40} strokeWidth={1.5} />
      </span>
    );
  }
  return (
    <span className="icon-tile">
      <img src={`/assets/icons/${icon}-navy.png`} alt={label} width="40" height="40" loading="lazy" decoding="async" />
    </span>
  );
}

function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero-section relative isolate overflow-hidden text-white" aria-labelledby="hero-title" data-testid="section-hero">
        <img src="/assets/brand-svg/heraz-mark-turquoise.svg" alt="" aria-hidden="true" width="640" height="640" className="hero-mark" />
        <div className="page-wrap relative z-10 flex min-h-[440px] flex-col justify-center py-10 md:min-h-[520px] md:py-16">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="hero-title display-font max-w-[780px] text-[clamp(2rem,5vw,3.5rem)] leading-[1.35] text-white" data-testid="heading-hero">
                صورة طفلك...<br className="hidden sm:block" /> هويته الرقمية
              </h1>
              <p className="mt-5 max-w-[690px] text-lg font-normal leading-[1.9] text-white/85 md:text-xl" data-testid="text-hero-description">
                حِرز منصة توعوية تمكّنك من إدراك مخاطر التزييف والنسخ البصري بالذكاء الاصطناعي، وتحمي هوية طفلك قبل أن تنشر
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/understand" data-testid="button-hero-understand" className="primary-button">
                  <span>ابدأ بفهم الاستنساخ</span><ArrowLeft size={19} aria-hidden="true" />
                </Link>
                <Link href="/quiz" data-testid="button-hero-quiz" className="secondary-button secondary-button-light">
                  <span>اختبر وعيك</span><ArrowLeft size={19} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90" aria-label="معلومات الخصوصية">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={18} strokeWidth={1.75} className="text-[var(--turquoise)]" aria-hidden="true" />
                  بدون تسجيل
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={18} strokeWidth={1.75} className="text-[var(--turquoise)]" aria-hidden="true" />
                  لا نجمع أي بيانات
                </span>
              </div>
            </div>
            <svg className="hero-geometric-illustration" viewBox="0 0 420 360" aria-hidden="true" focusable="false">
              <circle cx="164" cy="176" r="102" fill="none" stroke="var(--turquoise)" strokeWidth="2" opacity=".8" />
              <circle cx="246" cy="132" r="74" fill="none" stroke="var(--teal)" strokeWidth="2" opacity=".9" />
              <circle cx="244" cy="231" r="58" fill="none" stroke="var(--turquoise)" strokeWidth="2" opacity=".7" />
              <path d="M210 68 290 99v61c0 56-33 99-80 125-47-26-80-69-80-125V99l80-31Z" fill="rgba(81,237,200,.08)" stroke="var(--turquoise)" strokeWidth="3" />
              <path d="m178 160 22 22 43-47" fill="none" stroke="var(--turquoise)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="88" cy="76" r="8" fill="var(--teal)" />
              <circle cx="332" cy="274" r="7" fill="var(--turquoise)" />
            </svg>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="stat-strip page-wrap" aria-label="إحصاءات موثقة" data-testid="section-stat-strip">
          {stats.slice(0, 3).map((stat) => (
            <article className="stat-item" key={stat.sourceId}>
              <bdi dir="ltr" className="stat-value">{stat.value}</bdi>
              <p>{stat.label}</p>
              <Link href={`/sources#${stat.sourceId}`} aria-label={`المصدر ${stat.sourceId}`} className="stat-source">المصدر</Link>
            </article>
          ))}
        </section>
      )}

      <section className="mission-strip page-wrap" aria-labelledby="mission-strip-title" data-testid="section-mission-strip">
        <h2 id="mission-strip-title" className="mission-strip-text">
          تمكين أولياء الأمور بالمعارف الوقائية لحماية الهوية الرقمية للطفل
        </h2>
        <Link href="/about" className="secondary-button mission-strip-link" data-testid="link-mission-about">
          تعرّف علينا <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="bg-[var(--surface)] journey-section py-14 md:py-[72px]" aria-labelledby="journey-title" data-testid="section-journey">
        <div className="page-wrap">
          <h2 id="journey-title" className="section-title mb-8" data-testid="heading-journey">رحلتك في حِرز</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeyCards.map((card) => (
              <Link href={card.path} key={card.path} data-testid={`card-journey-${card.n}`} className="journey-card">
                <div className="mb-4 flex items-center justify-between">
                  <IdentityIcon icon={card.icon} label={card.title} />
                  <span className="journey-number" aria-label={`الخطوة ${card.n}`} data-testid={`text-journey-number-${card.n}`}>{card.n.padStart(2, '0')}</span>
                </div>
                <h3 className="heading-font mb-1 text-[1.375rem] leading-[1.5]">{card.title}</h3>
                <p className="mb-4 text-[1.0625rem] leading-[1.9]">{card.description}</p>
                <span className="mt-auto flex items-center justify-end" aria-hidden="true">
                  <ArrowLeft size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap py-14 md:py-[72px]" aria-labelledby="before-post-title" data-testid="section-before-post-banner">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--teal-30)] bg-[var(--turquoise-10)] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-y-0 right-0 w-1 rounded-full bg-[var(--teal)]" aria-hidden="true" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="pr-3">
              <h2 id="before-post-title" className="heading-font text-2xl leading-relaxed sm:text-[1.875rem]" data-testid="heading-before-post">قبل أن تنشر صورة طفلك، اسأل نفسك</h2>
              <p className="mt-1 text-[1.0625rem] text-[var(--navy)]/80" data-testid="text-before-post">أسئلة سريعة تساعدك تقرر بوعي.</p>
            </div>
            <Link href="/before-you-post" data-testid="button-open-checklist" className="primary-button shrink-0">
              افتح القائمة <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-14 md:pb-[72px]" aria-labelledby="kids-title" data-testid="section-kids-banner">
        <div className="kids-banner magazine-teaser relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-[var(--kids)]/20 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-center gap-5">
            <span className="icon-tile shrink-0">
              <img src="/assets/icons/family-navy.png" alt="أيقونة عائلة" width="58" height="58" loading="lazy" decoding="async" data-testid="img-kids-family-icon" />
            </span>
            <div>
              <h2 id="kids-title" className="heading-font text-[1.75rem] leading-relaxed kids-accent" data-testid="heading-kids-world">عالم حرز</h2>
              <p className="max-w-[52ch] text-[1.0625rem] leading-7" data-testid="text-kids-description">مجلة حرز التفاعلية للأطفال من 8 إلى 11 سنة</p>
            </div>
          </div>
          <Link href="/kids" data-testid="button-enter-kids-world" className="primary-button kids-button shrink-0">
            ادخل عالم حرز <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
