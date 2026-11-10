import { useState } from 'react';
import { helpFlowCopy } from '@/data/helpFlow';
import { postChecklistCopy, postChecklistGroups } from '@/data/postChecklist';
import { BidiText } from '@/components/heraz/BidiText';

type Answer = 'yes' | 'no';
type ChecklistQuestion = (typeof postChecklistGroups)[number]['questions'][number];

const questionCount = postChecklistGroups.reduce((count, group) => count + group.questions.length, 0);

export default function BeforeYouPostPage() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const answeredCount = Object.keys(answers).length;
  const needsReview = postChecklistGroups
    .reduce<ChecklistQuestion[]>((questions, group) => {
      questions.push(...group.questions);
      return questions;
    }, [])
    .filter((item) => answers[item.id] === 'no');
  const answeredAllQuestions = answeredCount === questionCount;

  const setAnswer = (questionId: number, answer: Answer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-wrap min-h-[56vh] py-10 sm:py-16" data-testid="page-before-you-post">
      <header className="page-heading-band mb-9">
        <p className="page-eyebrow" data-testid="text-page-eyebrow">{postChecklistCopy.pageTitle}</p>
        <h1 className="section-title mb-8" data-testid="heading-before-you-post">{postChecklistCopy.pageTitle}</h1>
      </header>

      <div className="grid gap-8">
        {postChecklistGroups.map((group, groupIndex) => (
          <section key={group.heading} aria-labelledby={`checklist-group-${groupIndex}`} data-testid={`checklist-group-${groupIndex + 1}`}>
            <h2 id={`checklist-group-${groupIndex}`} className="mb-4 text-base font-semibold text-[var(--navy)]/80" data-testid={`heading-checklist-group-${groupIndex + 1}`}>
              {group.heading}
            </h2>
            <ol className="grid gap-4">
              {group.questions.map((item) => (
                <li key={item.id}>
                  <div role="group" aria-labelledby={`checklist-question-${item.id}`} className="page-card p-5 sm:p-6" data-testid={`question-${item.id}`}>
                    <p id={`checklist-question-${item.id}`} className="text-[1.0625rem] font-semibold leading-8" data-testid={`text-question-${item.id}`}>
                      {item.question}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        aria-pressed={answers[item.id] === 'yes'}
                        onClick={() => setAnswer(item.id, 'yes')}
                        className={`min-h-11 min-w-20 rounded-full border px-5 text-sm font-bold transition-colors ${answers[item.id] === 'yes' ? 'border-[var(--teal)] bg-[var(--teal)] text-[var(--navy)]' : 'border-[var(--navy-30)] bg-white hover:bg-[var(--turquoise-10)]'}`}
                        data-testid={`answer-yes-${item.id}`}
                      >
                        {postChecklistCopy.yes}
                      </button>
                      <button
                        type="button"
                        aria-pressed={answers[item.id] === 'no'}
                        onClick={() => setAnswer(item.id, 'no')}
                        className={`min-h-11 min-w-20 rounded-full border px-5 text-sm font-bold transition-colors ${answers[item.id] === 'no' ? 'border-[var(--teal)] bg-[var(--teal)] text-[var(--navy)]' : 'border-[var(--navy-30)] bg-white hover:bg-[var(--turquoise-10)]'}`}
                        data-testid={`answer-no-${item.id}`}
                      >
                        {postChecklistCopy.no}
                      </button>
                    </div>
                    {answers[item.id] === 'no' && (
                      <div className="mt-4 rounded-xl bg-[var(--turquoise-10)] p-4" data-testid={`advice-${item.id}`}>
                        <p className="text-[1rem] leading-7"><BidiText text={item.advice} /></p>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.sourceLabel}، ${helpFlowCopy.externalNewTab}`}
                          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                          data-testid={`source-${item.id}`}
                        >
                          <BidiText text={item.sourceLabel} />
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-8 flex flex-col items-start gap-4 border-t border-[var(--navy-10)] pt-6" aria-live="polite" data-testid="checklist-summary">
        {!answeredAllQuestions ? (
          <p className="text-[1.0625rem] font-semibold" data-testid="text-checklist-summary">
            {postChecklistCopy.summaryPending(answeredCount)}
          </p>
        ) : needsReview.length === 0 ? (
          <p className="text-[1.0625rem] font-semibold" data-testid="text-checklist-result-all-yes">
            {postChecklistCopy.resultAllYes}
          </p>
        ) : (
          <div className="w-full" data-testid="checklist-result-needs-edits">
            <h2 className="mb-4 text-lg font-bold" data-testid="heading-checklist-result">
              {postChecklistCopy.resultNeedsEdits}
            </h2>
            <ul className="grid gap-4" data-testid="list-checklist-result">
              {needsReview.map((item) => (
                <li key={item.id} className="page-card p-5 sm:p-6" data-testid={`result-item-${item.id}`}>
                  <p className="text-[1rem] leading-7" data-testid={`result-advice-${item.id}`}>
                    <BidiText text={item.advice} />
                  </p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.sourceLabel}، ${helpFlowCopy.externalNewTab}`}
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                    data-testid={`result-source-${item.id}`}
                  >
                    <BidiText text={item.sourceLabel} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[1rem] leading-7" data-testid="text-checklist-after-editing">
              {postChecklistCopy.afterEditing}
            </p>
          </div>
        )}
        <button type="button" onClick={() => setAnswers({})} className="secondary-button min-h-11" data-testid="button-reset-checklist">
          {postChecklistCopy.reset}
        </button>
      </section>

      <p className="mt-5 text-sm text-[var(--navy)]/75" data-testid="text-checklist-sources">
        {postChecklistCopy.sources}
      </p>
    </main>
  );
}
