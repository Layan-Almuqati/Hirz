import { Link } from 'wouter';
import { PageHeader } from '@/components/heraz/layout';
import { protectContent } from '@/data/protectContent';
import { SourceReference } from '@/components/heraz/SourceMarker';

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
    </main>
  );
}
