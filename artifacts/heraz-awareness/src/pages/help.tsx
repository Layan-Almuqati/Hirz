import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'wouter';
import { BidiText } from '@/components/heraz/BidiText';
import {
  getKollonaAmnPrimaryHref,
  helpCases,
  helpFlowCopy,
  helpFlowLinks,
  type HelpAction,
  type HelpCase,
} from '@/data/helpFlow';

type StepStatus = 'pending' | 'done' | 'skipped';
type Progress = { caseNumber: number; stepNumber: number; statuses: StepStatus[] };

function getCase(caseNumber: number | undefined): HelpCase | undefined {
  return helpCases.find((item) => item.number === caseNumber);
}

export default function HelpPage() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [resumeProgress, setResumeProgress] = useState<Progress | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [unableToComplete, setUnableToComplete] = useState(false);
  const awaitingExternalReturn = useRef(false);
  const externalPageWasHidden = useRef(false);
  const triggeringExternalLink = useRef<HTMLAnchorElement | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const screenHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousProgress = useRef<Progress | null>(null);

  const selectedCase = getCase(progress?.caseNumber);
  const isEndScreen = Boolean(progress && selectedCase && progress.stepNumber > selectedCase.steps.length);
  const currentStep = progress && selectedCase && !isEndScreen
    ? selectedCase.steps[progress.stepNumber - 1]
    : undefined;
  const currentAction = currentStep?.action;
  const emergencyNoticeParts = helpFlowCopy.emergencyNotice.split(helpFlowLinks.emergency911.phoneNumber);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const openedFromProtect = query.get('from') === 'protect';
    if (openedFromProtect) {
      query.delete('from');
      const suffix = query.toString();
      const cleanUrl = `${window.location.pathname}${suffix ? `?${suffix}` : ''}${window.location.hash}`;
      window.history.replaceState(window.history.state, '', cleanUrl);
    }

  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && awaitingExternalReturn.current) {
        externalPageWasHidden.current = true;
        return;
      }
      if (document.visibilityState === 'visible' && awaitingExternalReturn.current && externalPageWasHidden.current) {
        awaitingExternalReturn.current = false;
        externalPageWasHidden.current = false;
        setConfirmationOpen(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!confirmationOpen) return;
    const dialog = dialogRef.current;
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
      if (triggeringExternalLink.current?.isConnected) {
        triggeringExternalLink.current.focus();
      } else {
        screenHeadingRef.current?.focus();
      }
    };
  }, [confirmationOpen]);

  useEffect(() => {
    if (previousProgress.current !== progress) {
      screenHeadingRef.current?.focus();
      previousProgress.current = progress;
    }
  }, [progress]);

  const updateProgress = (nextProgress: Progress) => {
    setResumeProgress(null);
    setUnableToComplete(false);
    setProgress(nextProgress);
  };

  const beginCase = (caseNumber: number) => {
    const selected = getCase(caseNumber);
    if (!selected) return;
    updateProgress({
      caseNumber,
      stepNumber: 1,
      statuses: selected.steps.map(() => 'pending'),
    });
  };

  const goBack = () => {
    setConfirmationOpen(false);
    if (progress) {
      setProgress(progress.stepNumber > 1
        ? { ...progress, stepNumber: progress.stepNumber - 1 }
        : null);
      return;
    }
    setLocation(helpFlowLinks.protectPage.href);
  };

  const advanceStep = (status: Exclude<StepStatus, 'pending'>) => {
    if (!progress || !selectedCase) return;
    const statuses = [...progress.statuses];
    if (progress.stepNumber <= selectedCase.steps.length) {
      statuses[progress.stepNumber - 1] = status;
    }
    updateProgress({
      caseNumber: progress.caseNumber,
      stepNumber: progress.stepNumber + 1,
      statuses,
    });
  };

  const returnToStep = (stepIndex: number) => {
    if (!progress) return;
    updateProgress({ ...progress, stepNumber: stepIndex + 1 });
  };

  const restart = () => {
    setProgress(null);
    setResumeProgress(null);
    setConfirmationOpen(false);
    setUnableToComplete(false);
  };

  const continueSavedProgress = () => {
    if (!resumeProgress) return;
    setResumeProgress(null);
    setUnableToComplete(false);
    setProgress(resumeProgress);
  };

  const startFromPrompt = () => {
    setProgress(null);
    setResumeProgress(null);
  };

  const handleExternalClick = (event: MouseEvent<HTMLAnchorElement>) => {
    triggeringExternalLink.current = event.currentTarget;
    awaitingExternalReturn.current = true;
    externalPageWasHidden.current = false;
    setUnableToComplete(false);
  };

  const finishExternalStep = () => {
    setConfirmationOpen(false);
    advanceStep('done');
  };

  const markCurrentStepSkipped = () => {
    advanceStep('skipped');
  };

  const unableMessage = currentAction === 'kollona-amn'
    ? helpFlowCopy.kollonaUnavailable
    : currentAction === 'sdaia-complaint'
      ? helpFlowCopy.sdaiaUnavailable
      : currentAction === 'emergency-911'
        ? 'إذا لم تستطع التأكد من سلامة طفلك الآن:'
        : '';

  const externalLinkProps = (accessibleName: string) => ({
    target: '_blank' as const,
    rel: 'noopener noreferrer',
    'aria-label': `${accessibleName}، ${helpFlowCopy.externalNewTab}`,
    onClick: handleExternalClick,
  });
  const kollonaPrimaryHref = getKollonaAmnPrimaryHref(typeof navigator === 'undefined' ? '' : navigator.userAgent);

  const renderKollonaLinks = () => (
    <div className="mt-5 flex flex-col items-start gap-4">
      <a
        href={kollonaPrimaryHref}
        {...externalLinkProps(helpFlowCopy.kollonaPrimary)}
        className="primary-button min-h-11"
        data-testid="link-kollona-amn-primary"
      >
        {helpFlowCopy.kollonaPrimary}
      </a>
      <div className="flex flex-wrap gap-3">
        {helpFlowLinks.kollonaAmnGooglePlay.href !== kollonaPrimaryHref && (
          <a href={helpFlowLinks.kollonaAmnGooglePlay.href} {...externalLinkProps(helpFlowCopy.googlePlay)} className="secondary-button min-h-11" data-testid="link-kollona-google-play">
            <BidiText text={helpFlowCopy.googlePlay} />
          </a>
        )}
        {helpFlowLinks.kollonaAmnAppStore.href !== kollonaPrimaryHref && (
          <a href={helpFlowLinks.kollonaAmnAppStore.href} {...externalLinkProps(helpFlowCopy.appStore)} className="secondary-button min-h-11" data-testid="link-kollona-app-store">
            <BidiText text={helpFlowCopy.appStore} />
          </a>
        )}
      </div>
      <p className="text-sm text-[var(--navy)]/80" data-testid="text-kollona-open-store-helper">
        {helpFlowCopy.openStoreHelper}
      </p>
      <p className="max-w-[65ch] text-[.9375rem] leading-7 text-[var(--navy)]/80" data-testid="text-kollona-instructions">
        {helpFlowCopy.kollonaInstructions}
      </p>
    </div>
  );

  const renderAction = (action: HelpAction) => {
    if (action === 'kollona-amn') return renderKollonaLinks();
    if (action === 'emergency-911') {
      return (
        <div className="mt-5">
          <a href={helpFlowLinks.emergency911.href} className="primary-button min-h-11" data-testid="link-emergency-911">
            اتصل <bdi dir="ltr">{helpFlowLinks.emergency911.phoneNumber}</bdi>
          </a>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => advanceStep('done')} className="secondary-button min-h-11" data-testid="button-emergency-next">
              {helpFlowCopy.next}
            </button>
            <button type="button" onClick={() => setUnableToComplete(true)} className="min-h-11 px-2 text-sm font-semibold underline underline-offset-4" data-testid="button-emergency-unable">
              {helpFlowCopy.unable}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-5">
        <a href={helpFlowLinks.personalDataComplaint.href} {...externalLinkProps('قدّم شكوى بيانات شخصية')} className="primary-button min-h-11" data-testid="link-sdaia-complaint">
          قدّم شكوى بيانات شخصية
        </a>
        <p className="mt-3 text-sm text-[var(--navy)]/80" data-testid="text-absher-needed">{helpFlowCopy.absherNeeded}</p>
      </div>
    );
  };

  const allStepsDone = Boolean(progress?.statuses.every((status) => status === 'done'));
  const incompleteSteps = selectedCase && progress
    ? progress.statuses.flatMap((status, index) => status === 'done' ? [] : [{ status, index, step: selectedCase.steps[index] }])
    : [];
  const reportStepIndex = selectedCase?.steps.findIndex((step) => step.action === 'kollona-amn') ?? -1;
  const reportStepDone = reportStepIndex >= 0 && progress?.statuses[reportStepIndex] === 'done';
  const showReportDuration = allStepsDone && reportStepDone && selectedCase?.number !== 4;

  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid="page-protect-help">
        <div className="mb-7">
          <button type="button" onClick={goBack} className="secondary-button min-h-11" data-testid="button-back">
            {helpFlowCopy.back}
          </button>
        </div>

        {!progress && (
          <section aria-labelledby="help-title" className="max-w-4xl">
            <p className="page-eyebrow" data-testid="text-page-eyebrow">احمِ</p>
            <h1 ref={screenHeadingRef} tabIndex={-1} id="help-title" className="section-title" data-testid="heading-help-title">{helpFlowCopy.pageTitle}</h1>
            <p className="mb-5 mt-2 text-[1.0625rem] text-[var(--navy)]/80 sm:text-lg" data-testid="text-help-subtitle">{helpFlowCopy.subtitle}</p>
            <p className="mb-6 text-[1.0625rem] font-semibold leading-8" data-testid="text-help-emergency-notice">
              <BidiText text={emergencyNoticeParts[0]} />
              <a href={helpFlowLinks.emergency911.href} className="underline underline-offset-4" data-testid="link-help-emergency-notice">
                <bdi dir="ltr">{helpFlowLinks.emergency911.phoneNumber}</bdi>
              </a>
              <BidiText text={emergencyNoticeParts[1]} />
            </p>
            {resumeProgress && (
              <section className="page-card mb-6 flex flex-wrap items-center justify-between gap-4 border-[var(--teal)] bg-[var(--turquoise-10)] p-5" data-testid="prompt-resume-help">
                <p className="text-[1.0625rem] font-semibold" data-testid="text-resume-help">{helpFlowCopy.resumeQuestion}</p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={continueSavedProgress} className="primary-button min-h-11" data-testid="button-resume-help">{helpFlowCopy.resume}</button>
                  <button type="button" onClick={startFromPrompt} className="secondary-button min-h-11" data-testid="button-new-help">{helpFlowCopy.startAgain}</button>
                </div>
              </section>
            )}
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
            <p className="page-eyebrow" data-testid="text-page-eyebrow">احمِ</p>
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
            <div className="page-card p-5 sm:p-8" data-testid={`card-help-step-${progress.stepNumber}`}>
              <p className="text-lg leading-9" data-testid="text-help-step">{currentStep.text}</p>
              {currentStep.action && renderAction(currentStep.action)}
              {unableToComplete && unableMessage && (
                <div className="mt-4 rounded-xl bg-[var(--turquoise-10)] p-4" data-testid="section-help-unable">
                  <p role="status" className="text-[1.0625rem] leading-8" data-testid="text-help-unable">{unableMessage}</p>
                  <button type="button" onClick={markCurrentStepSkipped} className="mt-2 inline-flex min-h-11 items-center text-[1rem] font-semibold underline underline-offset-4" data-testid="button-skip-help-step">
                    {helpFlowCopy.skipStep}
                  </button>
                </div>
              )}
              {!currentStep.action && (
                <div className="mt-6">
                  <button type="button" onClick={() => advanceStep('done')} className="primary-button min-h-11" data-testid="button-next-step">
                    {helpFlowCopy.next}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {progress && selectedCase && isEndScreen && (
          <section aria-labelledby="help-end-title" className="page-card max-w-4xl p-5 sm:p-8" data-testid={`screen-end-case-${selectedCase.number}`}>
            <p className="page-eyebrow" data-testid="text-page-eyebrow">احمِ</p>
            <h1 ref={screenHeadingRef} tabIndex={-1} id="help-end-title" className="section-title" data-testid="heading-help-end">
              {allStepsDone ? helpFlowCopy.endTitle : helpFlowCopy.incompleteEndTitle}
            </h1>
            {allStepsDone && showReportDuration && (
              <p className="mb-7 max-w-[65ch] text-[1.0625rem] leading-8 text-[var(--navy)]/80" data-testid="text-help-end-message">
                {helpFlowCopy.reportPrefix} {helpFlowCopy.endMessage}
              </p>
            )}
            {!allStepsDone && (
              <ol className="mb-7 grid gap-4" data-testid="list-incomplete-help-steps">
                {incompleteSteps.map(({ index, step }) => (
                  <li key={index} className="flex flex-col items-start gap-3 rounded-xl bg-[var(--turquoise-10)] p-4 sm:flex-row sm:items-center sm:justify-between" data-testid={`incomplete-step-${index + 1}`}>
                    <p className="text-[1rem] leading-7">{step.text}</p>
                    <button type="button" onClick={() => returnToStep(index)} className="secondary-button min-h-11 shrink-0" aria-label={`${helpFlowCopy.returnToStep} ${index + 1}`} data-testid={`button-return-to-step-${index + 1}`}>
                      {helpFlowCopy.returnToStep}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <button type="button" onClick={restart} className="secondary-button min-h-11" data-testid="button-start-again">
              {helpFlowCopy.startAgain}
            </button>
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
            className="w-full max-w-md rounded-2xl border border-[var(--navy-10)] bg-[#FFFFFF] p-6 shadow-2xl"
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
          </section>
        </div>
      )}
    </>
  );
}
