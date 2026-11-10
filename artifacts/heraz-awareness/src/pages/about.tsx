import { useEffect, useState } from 'react';
import { BadgeCheck, Eye, Lock, MousePointerClick, Scale, ShieldCheck, Target } from 'lucide-react';
import { Link } from 'wouter';
import { PageHeader } from '@/components/heraz/layout';
import { BidiText } from '@/components/heraz/BidiText';
import { aboutContent } from '@/data/aboutContent';
import './about.css';

declare const __BRAND_GUIDE_METADATA__: {
  sizeBytes: number;
  lastModifiedAt: string;
} | null;

const brandGuideUrl = `${import.meta.env.BASE_URL}brand/heraz-brand-guide.pdf`;
const valueIcons = [Lock, Scale, BadgeCheck, ShieldCheck, MousePointerClick] as const;
const brandGuideMetaLine = __BRAND_GUIDE_METADATA__
  ? `PDF · ${(__BRAND_GUIDE_METADATA__.sizeBytes / 1_000_000).toFixed(1)} MB · آخر تحديث: ${new Intl.DateTimeFormat(
      'ar-SA-u-ca-gregory-nu-latn',
      { day: 'numeric', month: 'long', year: 'numeric' },
    ).format(new Date(__BRAND_GUIDE_METADATA__.lastModifiedAt))}`
  : null;

function AboutPage() {
  const content = aboutContent;
  const { sections } = content;
  const [brandGuideAvailable, setBrandGuideAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(brandGuideUrl, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
        setBrandGuideAvailable(
          response.ok && (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')),
        );
      })
      .catch(() => setBrandGuideAvailable(false));

    return () => controller.abort();
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="about-page" data-testid="page-about">
      <div className="about-content page-wrap">
        <PageHeader
          title={content.title}
          description={content.subtitle}
          breadcrumbHome={content.breadcrumbHome}
          breadcrumbSeparator={content.breadcrumbSeparator}
        />

        <section className="about-section about-vision-section" aria-labelledby="about-vision-title">
          <h2 id="about-vision-title" className="about-section-title">
            <span>الرؤية و</span><span className="about-title-accent">الرسالة</span>
          </h2>
          <div className="about-vision-grid">
            {sections.visionMission.map((item, index) => {
              const Icon = index === 0 ? Eye : Target;
              return (
                <article className="about-vision-card about-glass-card" key={item.title} data-testid={`card-about-${index + 1}`}>
                  <span className="about-icon-badge" aria-hidden="true"><Icon size={24} strokeWidth={2.2} /></span>
                  <div className="about-card-copy">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-values-title">
          <h2 id="about-values-title" className="about-section-title">
            <span className="about-title-accent">{sections.valuesTitle}</span>
          </h2>
          <div className="about-values-grid">
            {sections.values.map((value, index) => {
              const Icon = valueIcons[index]!;
              return (
                <article className="about-value-card about-glass-card" key={value.title} data-testid={`card-about-value-${index + 1}`}>
                  <span className="about-icon-badge" aria-hidden="true"><Icon size={23} strokeWidth={2.2} /></span>
                  <div className="about-card-copy">
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="about-section about-brand-files" aria-labelledby="about-brand-files-title">
          <h2 id="about-brand-files-title" className="about-section-title">
            <span>ملفات </span><span className="about-title-accent">الهوية</span>
          </h2>
          <article className="about-brand-guide-card about-glass-card" data-testid="card-brand-guide">
            <div className="about-brand-guide-copy">
              <span className="about-brand-guide-tag">{sections.brandGuideTag}</span>
              <div>
                <h3>{sections.brandGuideTitle}</h3>
                <p>{sections.brandGuideDescription}</p>
                {brandGuideAvailable && brandGuideMetaLine ? (
                  <p className="about-brand-guide-meta" data-testid="brand-guide-meta">
                    <BidiText text={brandGuideMetaLine} />
                  </p>
                ) : null}
              </div>
            </div>
            {brandGuideAvailable ? (
              <a
                href={brandGuideUrl}
                download
                className="about-download-button"
                data-testid="link-brand-guide-download"
              >
                {sections.brandGuideDownload}
              </a>
            ) : (
              <button
                type="button"
                className="about-download-button"
                disabled
                aria-disabled="true"
                data-testid="button-brand-guide-coming-soon"
              >
                {sections.brandGuideUnavailable}
              </button>
            )}
          </article>
        </section>

        <div className="about-action-wrap">
          <Link href={content.action.href} className="primary-button about-action" data-testid="link-about-understand">
            {content.action.label}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
