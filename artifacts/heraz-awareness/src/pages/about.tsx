import { Link } from 'wouter';
import { PageHeader } from '@/components/heraz/layout';
import { aboutContent } from '@/data/aboutContent';
import './about.css';

const whiteLogo = '/assets/logo/heraz-logo-horizontal-white-turquoise.png';
const navyLogo = '/assets/logo/heraz-logo-horizontal-color.png';

function AboutPage() {
  const content = aboutContent;
  const { sections } = content;

  return (
    <main id="main-content" tabIndex={-1} className="about-page page-wrap" data-testid="page-about">
      <PageHeader
        title={content.title}
        description={content.subtitle}
        breadcrumbHome={content.breadcrumbHome}
        breadcrumbSeparator={content.breadcrumbSeparator}
      />

      <section className="about-vision-grid" aria-label={sections.visionMission.map((item) => item.title).join('، ')}>
        {sections.visionMission.map((item, index) => (
          <article className="about-vision-card" key={item.title} data-testid={`card-about-${index + 1}`}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="about-section" aria-labelledby="about-values-title">
        <h2 id="about-values-title" className="section-title">{sections.valuesTitle}</h2>
        <div className="about-values-grid">
          {sections.values.map((value, index) => (
            <article className="about-value-card" key={value.title} data-testid={`card-about-value-${index + 1}`}>
              <span className="about-value-number" aria-hidden="true">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-identity" aria-labelledby="about-identity-title">
        <h2 id="about-identity-title" className="section-title">{sections.identityTitle}</h2>
        <p className="about-identity-intro">{sections.identityIntro}</p>

        <div className="about-identity-block">
          <h3 className="about-block-caption">{sections.logoCaption}</h3>
          <div className="about-logo-grid">
            <div className="about-logo-card about-logo-card-navy">
              <img src={whiteLogo} alt={sections.logoAlt} />
            </div>
            <div className="about-logo-card about-logo-card-white">
              <img src={navyLogo} alt={sections.logoAlt} />
            </div>
          </div>
        </div>

        <div className="about-identity-block">
          <h3 className="about-block-caption">{sections.colorsCaption}</h3>
          <div className="about-swatches">
            {sections.colors.map((color, index) => (
              <div className="about-swatch-item" key={color.hex} data-testid={`swatch-about-${index + 1}`}>
                <div className="about-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <p>{color.name}</p>
                <bdi dir="ltr" className="about-hex">{color.hex}</bdi>
              </div>
            ))}
          </div>
        </div>

        <div className="about-identity-block">
          <h3 className="about-block-caption">{sections.fontsCaption}</h3>
          <div className="about-font-grid">
            <article className="about-font-card">
              <p className="about-font-sample about-alexandria">{sections.alexandria.sample}</p>
              <p className="about-font-sentence about-alexandria">{sections.alexandria.sentence}</p>
              <p className="about-font-label" dir="ltr">{sections.alexandria.label}</p>
            </article>
            <article className="about-font-card">
              <p className="about-font-sample about-thmanyah">{sections.thmanyah.sample}</p>
              <p className="about-font-label" dir="ltr">{sections.thmanyah.label}</p>
            </article>
          </div>
        </div>
      </section>

      <div className="about-action-wrap">
        <Link href={content.action.href} className="primary-button about-action" data-testid="link-about-understand">
          {content.action.label}
        </Link>
      </div>
    </main>
  );
}

export default AboutPage;
