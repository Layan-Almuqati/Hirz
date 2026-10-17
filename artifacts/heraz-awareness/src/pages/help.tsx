import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  getKollonaAmnPrimaryHref,
  helpCases,
  helpFlowCopy,
  helpFlowLinks,
  type HelpAction,
  type HelpCase,
} from '@/data/helpFlow';

type Progress = { caseNumber: number; stepNumber: number };

const CASE_STORAGE_KEY = 'heraz-help-case';
const STEP_STORAGE_KEY = 'heraz-help-step';

function readProgress(): Progress | null {
  try {
    const caseValue = sessionStorage.getItem(CASE_STORAGE_KEY);
    const stepValue = sessionStorage.getItem(STEP_STORAGE_KEY);
    if (!caseValue || !stepValue) return null;

    const caseNumber = Number(caseValue);
    const stepNumber = Number(stepValue);
    const selectedCase = helpCases.find((item) => item.number === caseNumber);
    if (!selectedCase || !Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > selectedCase.steps.length + 1) {
      sessionStorage.removeItem(CASE_STORAGE_KEY);
      sessionStorage.removeItem(STEP_STORAGE_KEY);
      return null;
    }
    return { caseNumber, stepNumber };
  } catch {
    return null;
  }
}

function saveProgress(progress: Progress) {
  try {
    sessionStorage.setItem(CASE_STORAGE_KEY, String(progress.caseNumber));
    sessionStorage.setItem(STEP_STORAGE_KEY, String(progress.stepNumber));
  } catch {
    // The flow continues in memory when session storage is unavailable.
  }
}

function clearProgress() {
  try {
    sessionStorage.removeItem(CASE_STORAGE_KEY);
    sessionStorage.removeItem(STEP_STORAGE_KEY);
  } catch {
    // The flow can still restart in memory when session storage is unavailable.
  }
}

function findCase(caseNumber: number | undefined): HelpCase | undefined {
  return helpCases.find((item) => item.number === caseNumber);
}

export default function HelpPage() {
  const [progress, setProgress] = useState<Progress | null>(readProgress);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [unableToComplete, setUnableToComplete] = useState(false);
  const awaitingReturn = useRef(false);
  const dialogRef = useRef<HTMLElement>(null);
  const screenHeadingRef = useRef<HTMLHeadingElement>(null);

  const selectedCase = findCase(progress?.caseNumber);
  const isEndScreen = Boolean(progress && selectedCase && progress.stepNumber > selectedCase.steps.length);
  const currentStep = progress && selectedCase && !isEndScreen
    ? selectedCase.steps[progress.stepNumber - 1]
    : undefined;
  const currentAction = currentStep?.action;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && awaitingReturn.current) {
        awaitingReturn.current = false;
        setConfirmationOpen(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!confirmationOpen) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(
      dialog?.querySelectorAll<HTMLElement>('button, a[href]') ?? [],
    ).filter((element) => !element.hasAttribute('disabled'));
    focusable()[0]?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setConfirmationOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = focusable();
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKeys);
    return () => {
      document.removeEventListener('keydown', handleDialogKeys);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [confirmationOpen]);

  useEffect(() => {
    screenHeadingRef.current?.focus();
  }, [progress]);

  const updateProgress = (nextProgress: Progress) => {
    saveProgress(nextProgress);
    setUnableToComplete(false);
    setProgress(nextProgress);
  };

  const beginCase = (caseNumber: number) => updateProgress({ caseNumber, stepNumber: 1 });

  const goBack = () => {
    setConfirmationOpen(false);
    setUnableToComplete(false);
    if (!progress || !selectedCase) return;
    if (progress.stepNumber > 1) {
      updateProgress({ caseNumber: progress.caseNumber, stepNumber: progress.stepNumber - 1 });
      return;
    }
    clearProgress();
    setProgress(null);
  };

  const advanceStep = () => {
    if (!progress || !selectedCase) return;
    updateProgress({ caseNumber: progress.caseNumber, stepNumber: progress.stepNumber + 1 });
  };

  const restart = () => {
    clearProgress();
    setProgress(null);
    setConfirmationOpen(false);
    setUnableToComplete(false);
  };

  const handleExternalClick = () => {
    awaitingReturn.current = true;
    setUnableToComplete(false);
  };

  const finishExternalStep = () => {
    setConfirmationOpen(false);
    setUnableToComplete(false);
    advanceStep();
  };

  const unableMessage = currentAction === 'kollona-amn'
    ? helpFlowCopy.kollonaUnavailable
    : currentAction === 'sdaia-complaint'
      ? helpFlowCopy.sdaiaUnavailable
      : currentAction === 'emergency-911'
        ? 'إذا لم تستطع التأكد من سلامة طفلك الآن.'
        : '';

  const externalLinkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: handleExternalClick,
  } as const;

  const renderKollonaLinks = () => (
    <div className="mt-5 flex flex-col items-start gap-4">
      <a
        href={getKollonaAmnPrimaryHref(typeof navigator === 'undefined' ? '' : navigator.userAgent)}
        {...externalLinkProps}
        className="primary-button min-h-11"
        data-testid="link-kollona-amn-primary"
      >
        {helpFlowCopy.kollonaPrimary}
      </a>
      <div className="flex flex-wrap gap-3">
        <a href={helpFlowLinks.kollonaAmnGooglePlay.href} {...externalLinkProps} className="secondary-button min-h-11" data-testid="link-kollona-google-play">
          {helpFlowCopy.googlePlay}
        </a>
        <a href={helpFlowLinks.kollonaAmnAppStore.href} {...externalLinkProps} className="secondary-button min-h-11" data-testid="link-kollona-app-store">
          {helpFlowCopy.appStore}
        </a>
      </div>
      <a href={helpFlowLinks.officialServicePage.href} {...externalLinkProps} className="min-h-11 inline-flex items-center text-sm font-semibold underline underline-offset-4" data-testid="link-kollona-official-service">
        {helpFlowCopy.officialServiceLink}
      </a>
      <p className="max-w-[65ch] text-[15px] leading-7 text-[var(--navy)]/80" data-testid="text-kollona-instructions">
        {helpFlowCopy.kollonaInstructions}
      </p>
    </div>
  );

  const renderAction = (action: HelpAction) => {
    if (action === 'kollona-amn') return renderKollonaLinks();
    if (action === 'emergency-911') {
      return (
        <div className="mt-5">
          <a href={helpFlowLinks.emergency911.href} {...externalLinkProps} className="primary-button min-h-11" data-testid="link-emergency-911">
            اتصل 911
          </a>
        </div>
      );
    }
    return (
      <div className="mt-5">
        <a href={helpFlowLinks.personalDataComplaint.href} {...externalLinkProps} className="primary-button min-h-11" data-testid="link-sdaia-complaint">
          قدّم شكوى بيانات شخصية
        </a>
        <p className="mt-3 text-sm text-[var(--navy)]/80" data-testid="text-absher-needed">{helpFlowCopy.absherNeeded}</p>
      </div>
    );
  };

  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid="page-protect-help">
        <div className="mb-7">
          {!progress ? (
            <Link href={helpFlowLinks.protectPage.href} className="secondary-button min-h-11" data-testid="link-back-to-protect">
              {helpFlowCopy.back}
            </Link>
          ) : (
            <button type="button" onClick={goBack} className="secondary-button min-h-11" data-testid="button-back">
              {helpFlowCopy.back}
            </button>
          )}
        </div>

        {!progress && (
          <section aria-labelledby="help-title" className="max-w-4xl">
            <h1 ref={screenHeadingRef} tabIndex={-1} id="help-title" className="section-title" data-testid="heading-help-title">{helpFlowCopy.pageTitle}</h1>
            <p className="mb-8 mt-2 text-[17px] text-[var(--navy)]/80 sm:text-lg" data-testid="text-help-subtitle">{helpFlowCopy.subtitle}</p>
            <div className="grid gap-4 md:grid-cols-2" data-testid="list-help-cases">
              {helpCases.map((helpCase) => (
                <button
                  key={helpCase.number}
                  type="button"
                  onClick={() => beginCase(helpCase.number)}
                  className="page-card flex min-h-28 w-full items-center justify-between gap-4 text-right transition-colors hover:border-[var(--teal)] hover:bg-[var(--turquoise-10)]"
                  data-testid={`button-case-${helpCase.number}`}
                >
                  <span className="text-lg font-semibold leading-8">{helpCase.title}</span>
                  <span aria-hidden="true" className="shrink-0 text-2xl text-[var(--teal)]">←</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {progress && selectedCase && !isEndScreen && currentStep && (
          <section aria-labelledby="help-case-title" className="max-w-4xl" data-testid={`screen-case-${selectedCase.number}`}>
            <h1 ref={screenHeadingRef} tabIndex={-1} id="help-case-title" className="section-title" data-testid="heading-help-case">{selectedCase.title}</h1>
            <div className="mb-7 mt-5 max-w-xl">
              <p className="mb-2 text-sm font-semibold" aria-live="polite" data-testid="text-help-progress">
                {helpFlowCopy.progress(progress.stepNumber, selectedCase.steps.length)}
              </p>
              <div
                role="progressbar"
                aria-label={helpFlowCopy.progress(progress.stepNumber, selectedCase.steps.length)}
                aria-valuemin={1}
                aria-valuemax={selectedCase.steps.length}
                aria-valuenow={progress.stepNumber}
                className="h-2 overflow-hidden rounded-full bg-[var(--navy-10)]"
                data-testid="progress-help-step"
              >
                <div
                  className="h-full rounded-full bg-[var(--teal)] transition-[width]"
                  style={{ width: `${(progress.stepNumber / selectedCase.steps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="page-card" data-testid={`card-help-step-${progress.stepNumber}`}>
              <p className="text-lg leading-9" data-testid="text-help-step">{currentStep.text}</p>
              {currentStep.action && renderAction(currentStep.action)}
              {unableToComplete && unableMessage && (
                <p role="status" className="mt-4 rounded-xl bg-[var(--turquoise-10)] p-4 text-[17px] leading-8" data-testid="text-help-unable">
                  {unableMessage}
                </p>
              )}
              {!currentStep.action && (
                <div className="mt-6">
                  <button type="button" onClick={advanceStep} className="primary-button min-h-11" data-testid="button-next-step">
                    {helpFlowCopy.next}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {progress && selectedCase && isEndScreen && (
          <section aria-labelledby="help-end-title" className="page-card max-w-4xl" data-testid={`screen-end-case-${selectedCase.number}`}>
            <h1 ref={screenHeadingRef} tabIndex={-1} id="help-end-title" className="section-title" data-testid="heading-help-end">{helpFlowCopy.endTitle}</h1>
            {selectedCase.showEndMessage && (
              <p className="mb-7 max-w-[65ch] text-[17px] leading-8 text-[var(--navy)]/80" data-testid="text-help-end-message">
                {helpFlowCopy.endMessage}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href={helpFlowLinks.protectPage.href} className="primary-button min-h-11" data-testid="link-secure-accounts">
                {helpFlowCopy.secureAccounts}
              </Link>
              <button type="button" onClick={restart} className="secondary-button min-h-11" data-testid="button-start-again">
                {helpFlowCopy.startAgain}
              </button>
            </div>
          </section>
        )}

        <p className="mt-12 rounded-2xl border border-[var(--navy-10)] bg-white/70 px-5 py-4 text-center text-sm leading-7 text-[var(--navy)]/80" data-testid="text-help-permanent-note">
          {helpFlowCopy.permanentNote}
        </p>
      </main>

      {confirmationOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(29,34,84,.55)] p-5" data-testid="modal-help-return">
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-return-title"
            className="w-full max-w-md rounded-2xl border border-[var(--navy-10)] bg-white p-6 shadow-2xl"
          >
            <h2 id="help-return-title" className="mb-6 text-xl font-bold" data-testid="heading-help-return">
              {helpFlowCopy.returnConfirmation}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={finishExternalStep} className="primary-button min-h-11" data-testid="button-help-complete">
                {helpFlowCopy.complete}
              </button>
              <button type="button" onClick={() => { setConfirmationOpen(false); setUnableToComplete(true); }} className="secondary-button min-h-11" data-testid="button-help-unable">
                {helpFlowCopy.unable}
              </button>
            </div>
            <button type="button" onClick={goBack} className="mt-5 min-h-11 text-sm font-semibold underline underline-offset-4" data-testid="button-help-modal-back">
              {helpFlowCopy.back}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
