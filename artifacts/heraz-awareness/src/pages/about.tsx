import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { BidiText } from '@/components/heraz/BidiText';
import { downloads as initialDownloads, type HerazDownload } from '@/data/downloads';
import { studentNames, supervisorName } from '@/data/team';
import PersonAvatar, { SupervisorAvatar } from '@/components/heraz/PersonAvatar';
import AboutVisualIdentity from '@/components/heraz/AboutVisualIdentity';
import './about.css';

const aboutAnchors = [
  { id: 'vision', label: 'الرؤية' },
  { id: 'mission', label: 'الرسالة' },
  { id: 'objectives', label: 'الأهداف' },
  { id: 'why-heraz', label: 'لماذا حرز؟' },
  { id: 'visual-identity', label: 'الهوية البصرية' },
  { id: 'downloads', label: 'ملفات الهوية' },
  { id: 'team', label: 'فريق العمل' },
  { id: 'values', label: 'القيم' },
] as const;

const objectives = [
  'التوعية بمخاطر إساءة استخدام صور الأطفال وبياناتهم وآثارها المحتملة.',
  'تمكين أولياء الأمور من تطبيق الممارسات الوقائية وتعريفهم بالحقوق والتشريعات ذات الصلة.',
  'تقديم منصة تفاعلية للأسر ومجلة تثقيفية مخصصة للأطفال.',
] as const;

const values = ['الخصوصية', 'المسؤولية', 'المصداقية', 'الأمان الرقمي', 'التفاعلية'] as const;

const whyHeraz = [
  'توفير منصة رقمية تفاعلية وموارد إرشادية تسهم في حماية الأطفال والحد من المخاطر الرقمية.',
  'تحقيق التوافق مع توجهات رؤية السعودية 2030 في بناء مجتمع حيوي وتعزيز دور الأسرة الفاعل في حماية الأبناء وإعداد مستقبلهم الرقمي الآمن.',
  'الانسجام مع أهداف التنمية المستدامة، لا سيما الهدف الرابع (التعليم الجيد) لتقديم محتوى تثقيفي بالسلامة الرقمية، والهدف السادس عشر (السلام والعدل والمؤسسات القوية) لحماية الأطفال من الإساءة والاستغلال الرقمي.',
  'تساعد صانعي القرار والجهات المختصة نحو سن السياسات والتشريعات اللازمة لمواجهة مخاطر التزييف العميق وانتهاك الهوية الرقمية للأطفال عبر المنصات.',
] as const;

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <header className="about-section-heading">
      <h2 id={`${id}-heading`}>{children}</h2>
      <span className="about-heading-underline" aria-hidden="true" />
    </header>
  );
}

export default function AboutPage() {
  const [currentSection, setCurrentSection] = useState('vision');
  const [downloads, setDownloads] = useState<HerazDownload[]>(initialDownloads);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!aboutAnchors.some((anchor) => anchor.id === id)) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    const verifyDownloads = async () => {
      const available = await Promise.all(initialDownloads.map(async (item) => {
        try {
          const response = await fetch(item.file, { method: 'HEAD' });
          return response.ok ? item : null;
        } catch {
          return null;
        }
      }));
      if (active) setDownloads(available.filter((item): item is HerazDownload => item !== null));
    };
    void verifyDownloads();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-testid="page-scroll-container"]');
    const sections = aboutAnchors
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setCurrentSection(visible.target.id);
    }, { root, rootMargin: '-120px 0px -60% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [downloads.length]);

  const visibleAnchors = downloads.length ? aboutAnchors : aboutAnchors.filter((item) => item.id !== 'downloads');

  return (
    <main id="main-content" tabIndex={-1} className="about-page" data-testid="page-about">
      <header className="about-page-heading">
        <div className="page-wrap">
          <p className="page-eyebrow">عن حِرز</p>
          <h1 className="section-title mb-0" data-testid="heading-about">عن حِرز</h1>
        </div>
      </header>

      <nav className="about-anchor-nav" aria-label="أقسام عن حرز" data-testid="about-anchor-nav">
        <div className="page-wrap about-anchor-scroll">
          {visibleAnchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className={`about-anchor-link ${currentSection === anchor.id ? 'is-current' : ''}`}
              aria-current={currentSection === anchor.id ? 'location' : undefined}
              data-testid={`about-anchor-${anchor.id}`}
            >
              {anchor.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="page-wrap about-content">
        <div className="about-statements">
          <section id="vision" className="about-statement-card" aria-labelledby="vision-heading" data-testid="section-about-vision">
            <SectionHeading id="vision">الرؤية</SectionHeading>
            <p className="about-statement-text about-vision-text">مستقبل رقمي آمن يحفظ هوية الأطفال وخصوصيتهم.</p>
          </section>
          <section id="mission" className="about-statement-card" aria-labelledby="mission-heading" data-testid="section-about-mission">
            <SectionHeading id="mission">الرسالة</SectionHeading>
            <p className="about-statement-text">
              تمكين أولياء الأمور بالمعارف الوقائية، والإرشادات التفاعلية، والتشريعات الداعمة؛ لبناء وعي أسري مستدام يحمي الهوية الرقمية للطفل في عصر الذكاء الاصطناعي.
            </p>
          </section>
        </div>

        <section id="objectives" className="about-section" aria-labelledby="objectives-heading" data-testid="section-about-objectives">
          <SectionHeading id="objectives">الأهداف</SectionHeading>
          <ul className="about-objectives-grid m-0 list-none p-0" role="list">
            {objectives.map((objective, index) => (
              <li className="about-objective-card" key={objective} data-testid={`about-objective-${index + 1}`}>
                <span className="about-objective-number" aria-hidden="true">•</span>
                <p><BidiText text={objective} /></p>
              </li>
            ))}
          </ul>
        </section>

        <section id="why-heraz" className="about-section" aria-labelledby="why-heraz-heading" data-testid="section-about-why-heraz">
          <SectionHeading id="why-heraz">لماذا حرز؟</SectionHeading>
          <ul className="m-0 grid list-none gap-4 p-0" role="list">
            {whyHeraz.map((reason, index) => (
              <li className="page-card flex items-start gap-3" key={reason} data-testid={`about-why-heraz-${index + 1}`}>
                <span aria-hidden="true">•</span>
                <p className="m-0"><BidiText text={reason} /></p>
              </li>
            ))}
          </ul>
        </section>

        <section id="visual-identity" className="about-section" aria-labelledby="visual-identity-heading" data-testid="section-about-visual-identity">
          <SectionHeading id="visual-identity">الهوية البصرية</SectionHeading>
          <AboutVisualIdentity />
          {downloads.length > 0 && (
            <div className="about-identity-download">
              {downloads.map((item) => (
                <article id="downloads" aria-labelledby="downloads-heading" className="about-download-card" key={item.file} data-testid="about-download-brand-guide">
                  <div className="about-download-copy">
                    <span className="about-download-badge"><BidiText text={item.badge} /></span>
                    <div>
                      <h3 id="downloads-heading" className="about-download-title">دليل الهوية البصرية</h3>
                      <p className="about-download-meta">
                        <bdi dir="ltr">{item.size}</bdi>
                      </p>
                    </div>
                  </div>
                  <a href={item.file} download className="primary-button about-download-button" data-testid="link-download-brand-guide">
                    تحميل <Download size={17} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="team" className="about-section" aria-labelledby="team-heading" data-testid="section-about-team">
          <SectionHeading id="team">فريق العمل</SectionHeading>
          <div className="about-team-grid">
            {studentNames.map((name, index) => (
              <article className="about-team-card" key={name} data-testid={`about-team-member-${index + 1}`}>
                <PersonAvatar />
                <p className="about-team-name"><BidiText text={name} /></p>
              </article>
            ))}
          </div>
          <article className="about-team-card about-supervisor-card" data-testid="about-supervisor">
            <SupervisorAvatar />
            <p className="about-team-name"><BidiText text={supervisorName} /></p>
          </article>
        </section>

        <section id="values" className="about-section" aria-labelledby="values-heading" data-testid="section-about-values">
          <SectionHeading id="values">القيم</SectionHeading>
          <ul className="about-values-grid">
            {values.map((value, index) => (
              <li className={`about-value-card ${index === 4 ? 'is-last-value' : ''}`} key={value}>{value}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
