import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { BidiText } from '@/components/heraz/BidiText';
import {
  getKollonaAmnPrimaryHref,
  helpCases,
  helpFlowCopy,
  helpFlowLinks,
  type HelpAction,
} from '@/data/helpFlow';

const caseHref = (number: number) => `/protect/help/${number}`;

function ExternalActionLink({ href, label, testId }: { href: string; label: string; testId: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}، ${helpFlowCopy.externalNewTab}`}
      className="primary-button min-h-11"
      data-testid={testId}
    >
      <BidiText text={label} />
    </a>
  );
}

function HelpActionLinks({ action, caseNumber, stepIndex }: { action: HelpAction; caseNumber: number; stepIndex: number }) {
  if (action === 'emergency-911') {
    const parts = helpFlowCopy.emergencyNotice.split(helpFlowLinks.emergency911.phoneNumber);
    return (
      <a
        href={helpFlowLinks.emergency911.href}
        aria-label={`${parts[0]}${helpFlowLinks.emergency911.phoneNumber}${parts[1]}`.trim()}
        className="primary-button mt-4 min-h-11"
        data-testid={`link-emergency-${caseNumber}-${stepIndex}`}
      >
        <BidiText text="اتصل" /> <bdi dir="ltr">{helpFlowLinks.emergency911.phoneNumber}</bdi>
      </a>
    );
  }

  if (action === 'sdaia-complaint') {
    return (
      <ExternalActionLink
        href={helpFlowLinks.personalDataComplaint.href}
        label="قدّم شكوى بيانات شخصية"
        testId={`link-sdaia-${caseNumber}-${stepIndex}`}
      />
    );
  }

  const primaryHref = getKollonaAmnPrimaryHref(typeof navigator === 'undefined' ? '' : navigator.userAgent);
  return (
    <div className="mt-4 grid justify-items-start gap-3">
      <ExternalActionLink href={primaryHref} label={helpFlowCopy.kollonaPrimary} testId={`link-kollona-${caseNumber}-${stepIndex}`} />
      <div className="flex flex-wrap gap-3">
        {helpFlowLinks.kollonaAmnGooglePlay.href !== primaryHref && (
          <ExternalActionLink
            href={helpFlowLinks.kollonaAmnGooglePlay.href}
            label={helpFlowCopy.googlePlay}
            testId={`link-google-play-${caseNumber}-${stepIndex}`}
          />
        )}
        {helpFlowLinks.kollonaAmnAppStore.href !== primaryHref && (
          <ExternalActionLink
            href={helpFlowLinks.kollonaAmnAppStore.href}
            label={helpFlowCopy.appStore}
            testId={`link-app-store-${caseNumber}-${stepIndex}`}
          />
        )}
      </div>
      <p className="text-sm leading-7 text-[var(--text-secondary)]" data-testid="text-kollona-open-store-helper">
        {helpFlowCopy.openStoreHelper}
      </p>
      <p className="max-w-[68ch] text-[.9375rem] leading-7 text-[var(--text-secondary)]" data-testid="text-kollona-instructions">
        {helpFlowCopy.kollonaInstructions}
      </p>
    </div>
  );
}

export function HelpPickerPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="page-wrap help-route-page py-10 md:py-14" data-testid="page-help-picker">
      <header className="mb-7 help-heading-band">
        <div className="page-heading-content">
        <h1 ref={headingRef} tabIndex={-1} className="section-title mb-3" data-testid="heading-help-picker">{helpFlowCopy.pageTitle}</h1>
        <p className="max-w-[68ch] text-lg leading-[1.9]" data-testid="text-help-picker-intro">{helpFlowCopy.subtitle}</p>
        <p className="mt-4 font-semibold leading-8" data-testid="text-help-emergency-notice"><BidiText text={helpFlowCopy.emergencyNotice} /></p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2" data-testid="help-case-picker-list">
        {helpCases.map((helpCase) => (
          <Link
            href={caseHref(helpCase.number)}
            className="help-case-card"
            key={helpCase.number}
            data-testid={`link-help-case-${helpCase.number}`}
          >
            <span className="help-case-card-content">
              <span className="help-case-card-title"><BidiText text={helpCase.title} /></span>
              <span className="help-case-card-description"><BidiText text={helpCase.steps[0]?.text ?? ''} /></span>
            </span>
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </main>
  );
}

export function HelpPlanPage() {
  const [, params] = useRoute('/protect/help/:caseId');
  const [, setLocation] = useLocation();
  const caseId = params?.caseId;
  const selectedCase = useMemo(
    () => helpCases.find((item) => String(item.number) === caseId),
    [caseId],
  );
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!selectedCase) {
      setLocation('/protect/help', { replace: true });
      return;
    }
    headingRef.current?.focus();
  }, [selectedCase, setLocation]);

  if (!selectedCase) return null;

  return (
    <main id="main-content" tabIndex={-1} className="page-wrap help-route-page py-10 md:py-14" data-testid={`page-help-plan-${selectedCase.number}`}>
      <Link href="/protect/help" className="help-back-link" data-testid="link-help-plan-back-top">
        <ArrowLeft size={18} aria-hidden="true" /> اختيار حالة أخرى
      </Link>
      <header className="mb-7 mt-6 help-heading-band">
        <div className="page-heading-content">
        <p className="page-eyebrow">{helpFlowCopy.pageTitle}</p>
        <h1 ref={headingRef} tabIndex={-1} className="section-title mb-3" data-testid={`heading-help-plan-${selectedCase.number}`}>
          <BidiText text={selectedCase.title} />
        </h1>
        </div>
      </header>

      <ol className="help-action-list" data-testid={`list-help-actions-${selectedCase.number}`}>
        {selectedCase.steps.map((step, index) => (
          <li className="help-action-row" key={`${selectedCase.number}-${index}`} data-testid={`step-help-${selectedCase.number}-${index + 1}`}>
            <span className="help-action-number" aria-hidden="true">{'٠١٢٣٤٥٦٧٨٩'[index + 1]}</span>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[1.0625rem] leading-[1.9]"><BidiText text={step.text} /></p>
              {step.action && <HelpActionLinks action={step.action} caseNumber={selectedCase.number} stepIndex={index + 1} />}
            </div>
          </li>
        ))}
      </ol>

      <div className="help-plan-bottom">
        <Link href="/protect/help" className="help-back-link" data-testid="link-help-plan-back-bottom">
          <ArrowLeft size={18} aria-hidden="true" /> اختيار حالة أخرى
        </Link>
        <p className="help-plan-disclaimer" data-testid="text-help-plan-disclaimer">{helpFlowCopy.permanentNote}</p>
      </div>
    </main>
  );
}
