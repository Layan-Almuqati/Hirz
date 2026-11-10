import { BidiText } from './BidiText';
import './about-visual-identity.css';

const identityParagraph = 'تعكس الهوية البصرية لمنصة «حرز» مفاهيم الأمان والحماية والثقة والوعي الرقمي؛ من خلال الأزرق الداكن الدال على الثقة والاستقرار، والأخضر الفيروزي المعبر عن الابتكار والتجدد والتطلع للمستقبل. ويجسد الشعار هذه المفاهيم عبر رمز الدرع والعناصر المتداخلة التي ترمز إلى التكامل بين الإنسان والتقنية. كما تدعم الهوية رسالتها بمجموعة من الأيقونات المعبرة عن حماية الأطفال والخصوصية الرقمية والأسرة والذكاء الاصطناعي، وتوظف خطي «Alexandria» و«Thmanyah Serif Display» لتحقيق الوضوح والتنوع البصري، بما يلائم أولياء الأمور والأطفال.';

export default function AboutVisualIdentity() {
  return (
    <>
      <p className="mb-6" data-testid="text-about-visual-identity"><BidiText text={identityParagraph} /></p>
      <div className="about-identity-grid">
        <div className="about-identity-logo" data-testid="about-identity-logo-card">
          <img
            src="/assets/logo/heraz-logo-horizontal-white-turquoise.png"
            alt="شعار حِرز"
            width="246"
            height="96"
          />
        </div>
        <article className="page-card about-identity-color" data-testid="about-identity-navy">
          <span className="about-identity-swatch" style={{ backgroundColor: 'var(--navy)' }} aria-hidden="true" />
          <p className="m-0">الأزرق الداكن · <bdi dir="ltr">#1D2254</bdi> · الثقة والاستقرار</p>
        </article>
        <article className="page-card about-identity-color" data-testid="about-identity-turquoise">
          <span className="about-identity-swatch" style={{ backgroundColor: 'var(--turquoise)' }} aria-hidden="true" />
          <p className="m-0">الأخضر الفيروزي · <bdi dir="ltr">#51EDC8</bdi> · الابتكار والتجدد</p>
        </article>
        <span className="about-identity-font about-identity-font-body" dir="ltr" data-testid="about-font-alexandria">Alexandria</span>
        <span className="about-identity-font about-identity-font-display" dir="ltr" data-testid="about-font-thmanyah">Thmanyah Serif Display</span>
      </div>
    </>
  );
}
