import { useEffect } from 'react';
import { PageHeader } from '@/components/heraz/layout';
import './about.css';
import './privacy.css';

const privacySections = [
  {
    title: 'ما الذي نجمعه؟',
    text: 'لا نجمع أي بيانات شخصية عن زوّار هذا الموقع، ولا نطلب منك تسجيل حساب أو إدخال معلومات.',
  },
  {
    title: 'ما الذي يُحفظ على جهازك؟',
    text: 'يحفظ المتصفح على جهازك فقط اختيارك للوضع الليلي أو النهاري وحجم الخط، وحالة اختبار «اختبر وعيك» أثناء الجلسة. لا تُرسل هذه المعلومات إلى أي جهة، ويمكنك مسحها من إعدادات المتصفح.',
  },
  {
    title: 'الروابط الخارجية',
    text: 'نشير في الموقع إلى مصادر رسمية وعلمية خارجية. لكل موقع منها سياسة خصوصية خاصة به، ولا نتحكم في ما يجمعه.',
  },
  {
    title: 'الاستضافة',
    text: 'قد تسجّل خدمة الاستضافة بيانات تقنية قياسية (مثل عنوان الشبكة ونوع المتصفح) لأغراض تشغيل الموقع وحمايته، وهي خارج سيطرة فريق المشروع.',
  },
  {
    title: 'أطفالنا',
    text: 'لا نطلب صور الأطفال أو بياناتهم في أي صفحة من صفحات الموقع، ولا ننصحك برفعها إلى أي جهة غير موثوقة.',
  },
] as const;

export default function PrivacyPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'سياسة الخصوصية — حِرز';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="about-page privacy-page" data-testid="page-privacy">
      <div className="about-content page-wrap">
        <PageHeader title="سياسة الخصوصية" description="" />
        <section className="privacy-sections" aria-label="بنود سياسة الخصوصية">
          {privacySections.map((section, index) => (
            <article className="about-glass-card privacy-card" key={section.title} data-testid={`privacy-section-${index + 1}`}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
