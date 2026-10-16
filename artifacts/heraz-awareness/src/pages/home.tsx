import { Link } from 'wouter';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';

const journeyCards = [
  {
    n: '1', title: 'افهم الاستنساخ الرقمي', path: '/understand',
    description: 'شرح مبسّط للمفهوم وكيف يحدث تقنيًا مع أمثلة تقرّب الفكرة.',
    icon: 'ai-chip',
  },
  {
    n: '2', title: 'المخاطر المستقبلية', path: '/risks',
    description: 'تعرّف على أثر استخدام صور الأطفال وبياناتهم في المحتوى المزيّف.',
    icon: 'photos',
  },
  {
    n: '3', title: 'قبل أن تنشر', path: '/before-you-post',
    description: 'أسئلة احترازية سريعة تراجعها قبل نشر أي صورة أو معلومة.',
    icon: 'shield-check',
  },
  {
    n: '4', title: 'احمِ هوية طفلك', path: '/protect',
    description: 'إجراءات وقائية وإعدادات خصوصية وخطوات للتعامل مع الاستخدام غير المصرّح.',
    icon: 'child-protected',
  },
  {
    n: '5', title: 'التشريعات', path: '/laws',
    description: 'تعرّف على الأنظمة والحقوق المرتبطة بحماية بيانات الأطفال.',
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
    return <span className="icon-tile" aria-hidden="true"><ClipboardCheck size={24} strokeWidth={1.75} /></span>;
  }
  return (
    <span className="icon-tile">
      <img src={`/assets/icons/${icon}-navy.png`} alt="" aria-label={label} />
    </span>
  );
}

function HomePage() {
  return (
    <main id="main-content">
      <section className="relative isolate overflow-hidden bg-[var(--navy)] text-white" aria-labelledby="hero-title" data-testid="section-hero">
        <img src="/assets/brand-svg/heraz-mark-turquoise.svg" alt="" className="hero-mark" aria-hidden="true" />
        <div className="page-wrap relative z-10 flex min-h-[510px] flex-col justify-center py-16 sm:min-h-[570px] sm:py-24">
          <p className="mb-5 text-sm font-semibold tracking-wide text-[var(--turquoise)]" data-testid="text-hero-eyebrow">حِرز — وعيٌ يحمي الهوية</p>
          <h1 id="hero-title" className="hero-title display-font max-w-[780px] text-[clamp(32px,5vw,56px)] leading-[1.35] text-white" data-testid="heading-hero">
            صورة طفلك...<br className="hidden sm:block" /> هويته الرقمية
          </h1>
          <p className="light-font mt-5 max-w-[690px] text-lg leading-[2] text-white/85 sm:text-[22px]" data-testid="text-hero-description">
            حِرز منصة توعوية تساعدك تفهم الاستنساخ الرقمي بالذكاء الاصطناعي وتحمي هوية طفلك قبل ما تنشر.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/understand" data-testid="button-hero-understand" className="primary-button">
              <span>ابدأ بفهم الاستنساخ</span><ArrowLeft size={19} aria-hidden="true" />
            </Link>
            <Link href="/quiz" data-testid="button-hero-quiz" className="secondary-button secondary-button-light">
              <span>اختبر وعيك</span><ArrowLeft size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-wrap grid gap-8 py-16 sm:py-20 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-16" aria-labelledby="what-title" data-testid="section-understanding-intro">
        <h2 id="what-title" className="section-title mb-0" data-testid="heading-what-is-cloning">ما هو الاستنساخ الرقمي؟</h2>
        <div>
          <p className="max-w-[65ch] text-lg leading-[1.9]" data-testid="text-what-is-cloning">
            الاستنساخ الرقمي هو استخدام تقنيات الذكاء الاصطناعي لتوليد صورة أو صوت أو مقطع يشبه شخصًا حقيقيًا. وعندما تُنشر صور الأطفال وبياناتهم، قد تُستخدم لهذا الغرض دون علم الأهل.
          </p>
          <Link href="/understand" data-testid="link-understand-details" className="mt-5 inline-flex min-h-11 items-center gap-3 font-bold underline decoration-[var(--teal)] decoration-2 underline-offset-4 hover:decoration-[var(--turquoise)]">
            اقرأ التفاصيل <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-[var(--surface)] py-16 sm:py-20" aria-labelledby="journey-title" data-testid="section-journey">
        <div className="page-wrap">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--navy)]/65">خطوة هادئة نحو معرفة أوضح</p>
              <h2 id="journey-title" className="section-title mb-0" data-testid="heading-journey">رحلتك في حِرز</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--navy)]/75">محتوى موجز يساعدك على الفهم واتخاذ قرارات واعية لحماية خصوصية طفلك.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeyCards.map((card) => (
              <Link href={card.path} key={card.path} data-testid={`card-journey-${card.n}`} className="journey-card">
                <div className="mb-4 flex items-center justify-between">
                  <IdentityIcon icon={card.icon} label={card.title} />
                  <span className="font-semibold text-[var(--navy)]/50" aria-label={`الخطوة ${card.n}`} data-testid={`text-journey-number-${card.n}`}>{card.n.padStart(2, '0')}</span>
                </div>
                <h3 className="heading-font mb-1 text-[22px] leading-[1.5]">{card.title}</h3>
                <p className="mb-4 text-sm leading-[1.9] text-[var(--navy)]/80">{card.description}</p>
                <span className="mt-auto flex items-center gap-2 text-sm font-bold" aria-label="انتقل إلى الصفحة">
                  اكتشف المزيد <ArrowLeft size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap py-14 sm:py-20" aria-labelledby="before-post-title" data-testid="section-before-post-banner">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--teal-30)] bg-[var(--turquoise-10)] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-[var(--teal)]" aria-hidden="true" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="pr-3">
              <h2 id="before-post-title" className="heading-font text-2xl leading-relaxed sm:text-[30px]" data-testid="heading-before-post">قبل أن تنشر صورة طفلك، اسأل نفسك</h2>
              <p className="mt-1 text-base text-[var(--navy)]/80" data-testid="text-before-post">أسئلة سريعة تساعدك تقرر بوعي.</p>
            </div>
            <Link href="/before-you-post" data-testid="button-open-checklist" className="primary-button shrink-0">
              افتح القائمة <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-16 sm:pb-20" aria-labelledby="kids-title" data-testid="section-kids-banner">
        <div className="flex flex-col gap-6 rounded-2xl border border-[var(--kids)]/20 bg-[var(--kids-10)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-center gap-5">
            <span className="icon-tile h-20 w-20 shrink-0">
              <img src="/assets/icons/family-navy.png" alt="أيقونة عائلة" className="h-16 w-16 object-contain" data-testid="img-kids-family-icon" />
            </span>
            <div>
              <h2 id="kids-title" className="heading-font text-[28px] leading-relaxed kids-accent" data-testid="heading-kids-world">عالم حرز</h2>
              <p className="max-w-[52ch] text-sm leading-7 sm:text-base" data-testid="text-kids-description">مجلة حرز التفاعلية للأطفال من 8 إلى 11 سنة</p>
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
