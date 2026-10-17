import { PageHeader, NextStep } from '@/components/heraz/layout';

const pageContent = {
  understand: {
    path: '/understand',
    title: 'افهم الاستنساخ الرقمي',
    description: 'شرح مبسّط للمفهوم وكيف يحدث تقنيًا مع أمثلة تقرّب الفكرة.',
  },
  risks: {
    path: '/risks',
    title: 'المخاطر المستقبلية',
    description: 'الأثر بعيد المدى لاستخدام صور الأطفال وبياناتهم في المحتوى المزيّف وانتحال الهوية.',
  },
  laws: {
    path: '/laws',
    title: 'التشريعات',
    description: 'الأنظمة والحقوق المرتبطة بحماية بيانات الأطفال.',
  },
  quiz: {
    path: '/quiz',
    title: 'اختبر وعيك',
    description: 'اختبار تفاعلي يقيس فهمك ويقدّم تغذية راجعة فورية.',
  },
  kids: {
    path: '/kids',
    title: 'عالم حرز',
    description: 'مجلة حرز التفاعلية للأطفال من 8 إلى 11 سنة.',
    kids: true,
  },
} as const;

type PageKey = keyof typeof pageContent;

function PlaceholderPage({ pageKey }: { pageKey: PageKey }) {
  const page = pageContent[pageKey];
  return (
    <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid={`page-${pageKey}`}>
      <PageHeader title={page.title} description={page.description} kids={'kids' in page && page.kids} />
      <section aria-label="محتوى الصفحة" className={`page-card ${'kids' in page && page.kids ? 'border-[var(--kids)]/30 bg-[var(--kids-10)]' : ''}`} data-testid="placeholder-card">
        <p className="text-center text-lg font-semibold" data-testid="status-content-pending">المحتوى قيد الإعداد</p>
      </section>
      <NextStep path={page.path} />
    </main>
  );
}

export default PlaceholderPage;
