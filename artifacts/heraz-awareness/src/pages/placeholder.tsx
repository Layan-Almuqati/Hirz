import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/heraz/layout';
import { BidiText } from '@/components/heraz/BidiText';
import { ChevronDown, Heart, Scale, Shield } from 'lucide-react';
import './laws.css';
import './understand-content.css';
import { understandContent } from '@/data/understandContent';
import { SourceReference } from '@/components/heraz/SourceMarker';
import MagazineReader from '@/components/heraz/MagazineReader';
import { toArabicIndic } from '@/lib/utils';
import { sources } from '@/data/sources';

const pageContent = {
  understand: {
    path: '/understand',
    title: 'افهم الاستنساخ الرقمي',
    description: 'شرح مبسّط للمفهوم وكيف يحدث تقنيًا مع أمثلة تقرّب الفكرة.',
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
    description: 'مجلة درع المستقبل التفاعلية للأطفال من 8 إلى 11 سنة.',
    kids: true,
  },
} as const;

type PageKey = keyof typeof pageContent;

const externalSources = {
  executiveRegulations: 'https://www.uqn.gov.sa/details?p=23595',
  article35: 'https://www.okaz.com.sa/news/local/2170629',
  cybercrime:
    'https://www.kfu.edu.sa/ar/Deans/it/Documents/%D8%A8%D8%B4%D8%A3%D9%86%20%D9%86%D8%B8%D8%A7%D9%85%20%D9%85%D9%83%D8%A7%D9%81%D8%AD%D8%A9%20%D8%AC%D8%B1%D8%A7%D8%A6%D9%85%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D8%A9%20-%20Fighting%20Law%20against%20IT%20crimes.pdf',
  childProtection:
    'https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/regulation-and-procedures/%D9%86%D8%B8%D8%A7%D9%85-%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%81%D9%84',
  familyViolence: 'https://www.hrsd.gov.sa/ar/ministry-services/services/1155125',
} as const;

const lawSourceNumbers: Record<string, number> = {
  [externalSources.executiveRegulations]: 1,
  [externalSources.article35]: 2,
  [externalSources.cybercrime]: 3,
  [externalSources.childProtection]: 4,
  [externalSources.familyViolence]: 5,
};

function SourceLink({ href, testId }: { href: string; testId: string }) {
  return <SourceReference url={href} number={lawSourceNumbers[href] ?? 1} testId={testId} />;
}

function LawsPage() {
  const [openLawIds, setOpenLawIds] = useState<Set<string>>(() => new Set(['personal-data']));
  const latestLawCheck = sources
    .filter((source) => source.page === 'التشريعات' && source.lastChecked)
    .map((source) => ({ date: source.lastChecked, timestamp: Date.parse(source.lastChecked) }))
    .filter((source) => Number.isFinite(source.timestamp))
    .sort((first, second) => second.timestamp - first.timestamp)[0]?.date;
  const toggleLaw = (lawId: string) => {
    setOpenLawIds((current) => {
      const next = new Set(current);
      if (next.has(lawId)) next.delete(lawId);
      else next.add(lawId);
      return next;
    });
  };
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.laws-page');
    const cards = page?.querySelectorAll<HTMLElement>('.laws-reveal');
    if (!page || !cards?.length || !('IntersectionObserver' in window)) return;

    page.classList.add('laws-motion-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('laws-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -32px 0px' },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="laws-page" dir="rtl" data-testid="page-laws">
      <div className="laws-content">
        <header className="laws-heading">
          <div className="page-heading-content">
          <h1 data-testid="heading-laws">ماذا تقول الأنظمة السعودية عن صور طفلك وبياناته؟</h1>
          <p className="laws-intro" data-testid="text-laws-intro">
            هذه الصفحة توعوية وليست استشارة قانونية. تنقل ما تنص عليه الأنظمة السعودية، وتطبيقها على حالة بعينها يرجع للجهات المختصة.
          </p>
          {latestLawCheck && (
            <p className="laws-last-checked" data-testid="text-laws-last-checked">
              آخر تحقق: <bdi dir="ltr">{latestLawCheck}</bdi>
            </p>
          )}
          </div>
        </header>

        <div className="laws-cards">
          <article className="laws-card laws-reveal" aria-labelledby="laws-title-1" data-testid="card-law-personal-data">
            <div className="laws-card-heading">
              <span className="laws-number" aria-hidden="true">١</span>
              <span className="laws-icon" aria-hidden="true"><Shield size={23} strokeWidth={1.8} /></span>
              <div className="laws-title-wrap">
                <h2 id="laws-title-1">
                  <button
                    type="button"
                    className="laws-accordion-trigger"
                    aria-expanded={openLawIds.has('personal-data')}
                    aria-controls="laws-content-personal-data"
                    onClick={() => toggleLaw('personal-data')}
                    data-testid="button-law-personal-data"
                  >
                    نظام حماية البيانات الشخصية
                    <ChevronDown aria-hidden="true" size={20} />
                  </button>
                </h2>
                <p className="laws-decree">المرسوم الملكي م/19 بتاريخ 9/2/1443هـ، المعدّل بالمرسوم م/148 بتاريخ 5/9/1444هـ</p>
              </div>
            </div>
            <div id="laws-content-personal-data" className="laws-accordion-content" hidden={!openLawIds.has('personal-data')}>
            <ol className="laws-list">
              <li>صورة طفلك بيانٌ شخصي. يعرّف النظام البيانات الشخصية بأنها كل بيان يؤدي إلى معرفة الفرد على وجه التحديد، ويذكر من أمثلتها «صور الفرد الثابتة أو المتحركة» (المادة 1).</li>
              <li>«المعالجة» في النظام تشمل الجمع والتخزين والإفصاح والنقل (المادة 1).</li>
              <li>يستثني النظام الاستخدام الشخصي أو العائلي ما دام صاحبه لا ينشر البيانات ولا يفصح عنها للآخرين (المادة 2).</li>
              <li>أي جهة تعالج بيانات من لم تكتمل أهليته تحتاج موافقة وليّ أمره، وعليها التحقق من صحة الولاية، وعلى الولي أن يتصرف بما يحقق مصلحة من يمثّله (اللائحة التنفيذية، المادة 13).</li>
              <li>لصاحب البيانات، ويمارسها وليّه نيابةً عنه إن كان ناقص الأهلية، حقوق منها: العلم، والاطلاع، والحصول على نسخة، والتصحيح، والإتلاف (المادة 4، واللائحة المادة 3).</li>
              <li>يحق العدول عن الموافقة في أي وقت، وعلى الجهة إيقاف المعالجة دون تأخير غير مبرر (اللائحة، المادة 12).</li>
            </ol>
            <section className="laws-subblock" aria-labelledby="laws-penalty-1">
              <h3 id="laws-penalty-1">العقوبة</h3>
              <p>من أفصح عن بيانات حساسة أو نشرها مخالفًا النظام، بقصد الإضرار بصاحبها أو تحقيق منفعة شخصية، يُعاقب بالسجن مدة لا تزيد على <strong>سنتين</strong> وبغرامة لا تزيد على <strong>3 ملايين ريال</strong>، أو بإحدى العقوبتين (المادة 35).</p>
            </section>
            <div className="laws-sources">
              <SourceLink href={externalSources.executiveRegulations} testId="link-source-executive-regulations" />
              <SourceLink href={externalSources.article35} testId="link-source-article-35" />
            </div>
            </div>
          </article>

          <article className="laws-card laws-reveal" aria-labelledby="laws-title-2" data-testid="card-law-cybercrime">
            <div className="laws-card-heading">
              <span className="laws-number" aria-hidden="true">٢</span>
              <span className="laws-icon" aria-hidden="true"><Scale size={23} strokeWidth={1.8} /></span>
              <div className="laws-title-wrap">
                <h2 id="laws-title-2">
                  <button
                    type="button"
                    className="laws-accordion-trigger"
                    aria-expanded={openLawIds.has('cybercrime')}
                    aria-controls="laws-content-cybercrime"
                    onClick={() => toggleLaw('cybercrime')}
                    data-testid="button-law-cybercrime"
                  >
                    نظام مكافحة جرائم المعلوماتية
                    <ChevronDown aria-hidden="true" size={20} />
                  </button>
                </h2>
              </div>
            </div>
            <div id="laws-content-cybercrime" className="laws-accordion-content" hidden={!openLawIds.has('cybercrime')}>
            <ol className="laws-list">
              <li>الجريمة المعلوماتية في النظام هي أي فعل يُرتكب باستخدام الحاسب الآلي أو الشبكة المعلوماتية بالمخالفة لأحكامه (المادة 1).</li>
            </ol>
            <section className="laws-subblock" aria-labelledby="laws-penalty-2">
              <h3 id="laws-penalty-2">العقوبات</h3>
              <ol className="laws-list laws-penalty-list">
                <li>السجن مدة لا تزيد على <strong>سنة</strong> وغرامة لا تزيد على <strong>500 ألف ريال</strong>، أو إحدى العقوبتين، على المساس بالحياة الخاصة بإساءة استخدام الهواتف المزودة بالكاميرا أو ما في حكمها، وعلى التشهير بالآخرين وإلحاق الضرر بهم عبر وسائل تقنيات المعلومات (المادة 3).</li>
                <li>السجن مدة لا تزيد على <strong>5 سنوات</strong> وغرامة لا تزيد على <strong>3 ملايين ريال</strong>، أو إحدى العقوبتين، على إنتاج ما من شأنه المساس بالنظام العام أو القيم الدينية أو الآداب العامة أو حرمة الحياة الخاصة، أو إعداده أو إرساله أو تخزينه عبر الشبكة المعلوماتية، وعلى إنشاء المواد المتعلقة بالشبكات الإباحية أو نشرها أو ترويجها (المادة 6).</li>
                <li>لا تقل العقوبة عن <strong>نصف حدها الأعلى</strong> إذا اقترنت الجريمة بالتغرير بالقصّر ومن في حكمهم واستغلالهم (المادة 8).</li>
                <li>يعاقب النظام كذلك من حرّض على الجريمة أو ساعد فيها أو اتفق عليها، ومن شرع في ارتكابها (المادتان 9 و10).</li>
              </ol>
            </section>
            <div className="laws-sources">
              <SourceLink href={externalSources.cybercrime} testId="link-source-cybercrime" />
            </div>
            </div>
          </article>

          <article className="laws-card laws-reveal" aria-labelledby="laws-title-3" data-testid="card-law-child-protection">
            <div className="laws-card-heading">
              <span className="laws-number" aria-hidden="true">٣</span>
              <span className="laws-icon" aria-hidden="true"><Heart size={23} strokeWidth={1.8} /></span>
              <div className="laws-title-wrap">
                <h2 id="laws-title-3">
                  <button
                    type="button"
                    className="laws-accordion-trigger"
                    aria-expanded={openLawIds.has('child-protection')}
                    aria-controls="laws-content-child-protection"
                    onClick={() => toggleLaw('child-protection')}
                    data-testid="button-law-child-protection"
                  >
                    نظام حماية الطفل
                    <ChevronDown aria-hidden="true" size={20} />
                  </button>
                </h2>
                <p className="laws-decree">المرسوم الملكي م/14 بتاريخ 3/2/1436هـ</p>
              </div>
            </div>
            <div id="laws-content-child-protection" className="laws-accordion-content" hidden={!openLawIds.has('child-protection')}>
            <ol className="laws-list">
              <li>الطفل: كل إنسان لم يتجاوز الثامنة عشرة من عمره.</li>
              <li>الإيذاء: كل شكل من أشكال الإساءة للطفل أو استغلاله أو التهديد بذلك، ومنه الإساءة الجسدية والنفسية والجنسية.</li>
              <li>الإساءة الجنسية: تعرّض الطفل لأي نوع من الاعتداء أو الأذى أو الاستغلال الجنسي.</li>
            </ol>
            <section className="laws-subblock laws-report-block" aria-labelledby="laws-report-title">
              <h3 id="laws-report-title">للإبلاغ</h3>
              <p>
                لإبلاغ عن حالة إيذاء: مركز بلاغات العنف الأسري التابع لوزارة الموارد البشرية على الرقم المجاني{' '}
                <a className="laws-phone" href="tel:1919" data-testid="link-laws-phone">1919</a>
                {' '}على مدار الساعة، أو على البريد{' '}
                <a className="laws-inline-link" href="mailto:1919@hrsd.gov.sa" data-testid="link-laws-email">1919@hrsd.gov.sa</a>. يستقبل المركز بلاغ أي مواطن أو مقيم، سواء تعرّض هو أو شخص آخر للأذى.
              </p>
            </section>
            <div className="laws-sources">
              <SourceLink href={externalSources.childProtection} testId="link-source-child-protection" />
              <SourceLink href={externalSources.familyViolence} testId="link-source-family-violence" />
            </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function UnderstandSourceLink({ href, testId }: { href: string; testId: string }) {
  const sourceNumbers: Record<string, number> = {
    'https://www.gao.gov/products/gao-20-379sp': 1,
    'https://sdaia.gov.sa/ar/SDAIA/eParticipation/consulting/SDAIADeepfakesGuidelinesAr.pdf': 2,
    'https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes': 3,
    'https://www.hrw.org/news/2024/06/10/brazil-childrens-personal-photos-misused-power-ai-tools': 4,
    'https://www.ic3.gov/PSA/2023/psa230605': 5,
  };
  return <SourceReference url={href} number={sourceNumbers[href] ?? 1} testId={testId} />;
}

function UnderstandContent() {
  const { definition, process, examples } = understandContent;

  return (
    <section className="understand-content" style={{ maxWidth: '68ch', marginInline: 'auto' }} aria-label="محتوى الاستنساخ الرقمي" data-testid="understand-content">
      <article className="understand-card" aria-labelledby="understand-definition-title" data-testid="card-understand-definition">
        <h2 id="understand-definition-title">{definition.title}</h2>
        <div className="understand-callout"><BidiText text={definition.callout} /></div>
        {definition.paragraphs.map((paragraph, index) => (
          <p key={paragraph} data-testid={`text-understand-definition-${index + 1}`}><BidiText text={paragraph} /></p>
        ))}
        <p className="understand-note" data-testid="text-understand-definition-note"><BidiText text={definition.note} /></p>
        <div className="understand-sources-row">
          {definition.sources.map((source) => (
            <UnderstandSourceLink key={source.id} href={source.href} testId={`link-source-definition-${source.id}`} />
          ))}
        </div>
      </article>

      <article className="understand-card" aria-labelledby="understand-process-title" data-testid="card-understand-process">
        <h2 id="understand-process-title">{process.title}</h2>
        <p data-testid="text-understand-process-intro"><BidiText text={process.intro} /></p>
        <div className="understand-steps">
          {process.steps.map((step, index) => (
            <section className="understand-step" key={step.title} data-testid={`step-understand-${index + 1}`}>
              <div className="understand-step-head">
                <span className="understand-step-number" aria-hidden="true">{toArabicIndic(index + 1)}</span>
                <h3><BidiText text={step.title} /></h3>
              </div>
              <p><BidiText text={step.text} /></p>
            </section>
          ))}
        </div>
        <p data-testid="text-understand-process-detail"><BidiText text={process.paragraph} /></p>
        <div className="understand-sources-row">
          {process.sources.map((source) => (
            <UnderstandSourceLink key={source.id} href={source.href} testId={`link-source-process-${source.id}`} />
          ))}
        </div>
      </article>

      <article className="understand-card" aria-labelledby="understand-examples-title" data-testid="card-understand-examples">
        <h2 id="understand-examples-title">{examples.title}</h2>
        <p data-testid="text-understand-examples-intro"><BidiText text={examples.intro} /></p>
        <div className="understand-examples">
          {examples.items.map((example, index) => (
            <section className="understand-example" key={example.title} data-testid={`card-understand-example-${index + 1}`}>
              <h3><BidiText text={example.title} /></h3>
              <p><BidiText text={example.text} /></p>
              <div className="understand-sources-row">
                {example.sources.map((source) => (
                  <UnderstandSourceLink key={source.id} href={source.href} testId={`link-source-example-${index + 1}-${source.id}`} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}

function PlaceholderPage({ pageKey }: { pageKey: PageKey }) {
  if (pageKey === 'laws') return <LawsPage />;
  const page = pageContent[pageKey];
  return (
    <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid={`page-${pageKey}`}>
      <PageHeader
        title={page.title}
        description={page.description}
        kids={'kids' in page && page.kids}
      />
      {pageKey === 'understand' ? (
        <UnderstandContent />
      ) : pageKey === 'kids' ? (
        <MagazineReader />
      ) : (
        <section aria-label="محتوى الصفحة" className={`page-card ${'kids' in page && page.kids ? 'border-[var(--kids)]/30 bg-[var(--kids-10)]' : ''}`} data-testid="placeholder-card">
          <p className="text-center text-lg font-semibold" data-testid="status-content-pending">المحتوى قيد الإعداد</p>
        </section>
      )}
    </main>
  );
}

export default PlaceholderPage;
