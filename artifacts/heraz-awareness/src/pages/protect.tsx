import { Link } from 'wouter';
import { PageHeader } from '@/components/heraz/layout';
import { protectContent } from '@/data/protectContent';
import { SourceReference } from '@/components/heraz/SourceMarker';
import { BidiText } from '@/components/heraz/BidiText';

const familyTips = [
  { questions: [7], text: 'ابتعد عن نشر صور تظهر الزي المدرسي لطفلك.' },
  { questions: [7], text: 'ابتعد عن نشر صور تظهر المكان أو المواعيد التي تعرّف بمكان طفلك.' },
  { questions: [8], text: 'اسأل أهالي الأطفال الآخرين قبل نشر صورهم أو مشاركتها أو وضع علامة عليهم.' },
  { questions: [9], text: 'اشرح لطفلك لماذا تريد نشر صورته واسأله هل يوافق.' },
  { questions: [9], text: 'احترم قرار طفلك إن فضّل ألا تنشر صورته.' },
  { questions: [10], text: 'لا تعتمد على الصوت وحده عند تلقي مكالمة بصوت يشبه صوت طفلك.' },
  { questions: [10], text: 'أنه المكالمة واتصل بالشخص على رقم تعرفه.' },
  { questions: [11], text: 'اتفقوا مسبقًا على كلمة سر عائلية لا يعرفها غيركم.' },
  { questions: [11], text: 'اطلب كلمة السر العائلية ممن يتصل مدعيًا أنه طفلك أو يطلب مالًا بسرعة.' },
  { questions: [12], text: 'قدّم بلاغًا عن ابتزاز طفلك بمحتوى مزيّف عبر تطبيق «كلنا أمن».' },
] as const;

export default function ProtectPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid="page-protect">
      <PageHeader title={protectContent.pageTitle} description={protectContent.pageDescription} />

      <div className="grid gap-5" data-testid="list-protect-cards">
        <section aria-labelledby="protect-entry-title" className="page-card w-full border-[var(--teal)] bg-[var(--turquoise-10)]" style={{ padding: '24px' }} data-testid="card-protect-entry">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 id="protect-entry-title" className="mb-3 flex items-center gap-3 text-2xl font-bold" data-testid="heading-protect-entry">
                <span className="help-action-number" aria-hidden="true">١</span>
                {protectContent.entry.title}
              </h2>
              <p className="text-[1.0625rem] leading-8 text-[var(--navy)]/80" data-testid="text-protect-entry">
                {protectContent.entry.text}
              </p>
            </div>
            <Link href={protectContent.entry.href} className="primary-button min-h-11 w-full justify-center md:w-auto md:shrink-0" data-testid="link-protect-entry">
              {protectContent.entry.button}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="protect-family-password-title" className="page-card w-full p-5 sm:p-8" data-testid="card-protect-family-password">
          <h2 id="protect-family-password-title" className="mb-4 flex items-center gap-3 text-xl font-bold" data-testid="heading-protect-family-password">
            <span className="help-action-number" aria-hidden="true">٢</span>
            {protectContent.familyPassword.title}
          </h2>
          <p className="mb-5 text-[1.0625rem] leading-8 text-[var(--navy)]/80" data-testid="text-protect-family-password">
            {protectContent.familyPassword.text}
          </p>
          <p className="mb-4 rounded-xl bg-[var(--turquoise-10)] p-4 text-[1.0625rem] font-semibold leading-8" data-testid="text-protect-family-password-action">
            {protectContent.familyPassword.action}
          </p>
          <p className="mb-4 text-sm text-[var(--navy)]/75" data-testid="text-protect-family-password-note">
            {protectContent.familyPassword.note}
          </p>
          <SourceReference url={protectContent.familyPassword.sourceHref} number={1} testId="link-protect-family-password-source" />
        </section>
      </div>
      <section id="family-tips" className="mt-16" aria-labelledby="family-tips-heading" data-testid="section-protect-family-tips">
        <h2 id="family-tips-heading" className="section-title mb-6">نصائح حرز للأسرة</h2>
        <ul className="m-0 grid list-none gap-4 p-0" role="list">
          {familyTips.map((tip, index) => (
            <li key={tip.text} className="page-card" data-testid={`family-tip-${index + 1}`}>
              <p className="m-0"><BidiText text={tip.text} /></p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
