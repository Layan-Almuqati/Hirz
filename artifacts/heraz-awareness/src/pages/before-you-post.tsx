import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { postChecklistCopy, postChecklistGroups } from '@/data/postChecklist';
import { BidiText } from '@/components/heraz/BidiText';
import { SourceReference } from '@/components/heraz/SourceMarker';

type Answer = 'yes' | 'no';
type ChecklistQuestion = (typeof postChecklistGroups)[number]['questions'][number];

const questionCount = postChecklistGroups.reduce((count, group) => count + group.questions.length, 0);
const checklistSourceNumbers: Record<string, number> = {
  'https://www.esafety.gov.au/parents/issues-and-advice/privacy-child': 1,
  'https://www.ic3.gov/PSA/2023/psa230605': 2,
};

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
        <div className="page-heading-content">
        <h1 className="section-title mb-8" data-testid="heading-before-you-post">{postChecklistCopy.pageTitle}</h1>
        </div>
      </header>

      <button
        type="button"
        onClick={() => window.print()}
        className="secondary-button mb-5 min-h-11"
        data-testid="button-print-checklist"
      >
        تنزيل القائمة PDF
      </button>

      <div className="checklist-progress-sticky" data-testid="checklist-progress-sticky">
        <div
          className="checklist-progress-track"
          role="progressbar"
          aria-label="تقدم القائمة"
          aria-valuemin={0}
          aria-valuemax={questionCount}
          aria-valuenow={answeredCount}
          data-testid="progress-checklist"
        >
          <div className="checklist-progress-fill" style={{ width: `${(answeredCount / questionCount) * 100}%` }} />
        </div>
      </div>

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
                      <BidiText text={item.question} />
                    </p>
                    <div className="checklist-answer-group mt-4 flex flex-wrap gap-3" role="radiogroup" aria-labelledby={`checklist-question-${item.id}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={answers[item.id] === 'yes'}
                        onClick={() => setAnswer(item.id, 'yes')}
                        className={`checklist-choice ${answers[item.id] === 'yes' ? 'is-yes' : ''}`}
                        data-testid={`answer-yes-${item.id}`}
                      >
                        {postChecklistCopy.yes}
                        <span className={`checklist-answer-icon ${answers[item.id] === 'yes' ? 'is-visible' : ''}`} aria-hidden="true">
                          <Check size={17} strokeWidth={2.5} />
                        </span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={answers[item.id] === 'no'}
                        onClick={() => setAnswer(item.id, 'no')}
                        className={`checklist-choice ${answers[item.id] === 'no' ? 'is-no' : ''}`}
                        data-testid={`answer-no-${item.id}`}
                      >
                        {postChecklistCopy.no}
                        <span className={`checklist-answer-icon ${answers[item.id] === 'no' ? 'is-visible' : ''}`} aria-hidden="true">
                          <X size={17} strokeWidth={2.5} />
                        </span>
                      </button>
                    </div>
                    <span className="checklist-print-answer-box" aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-8 flex flex-col items-start gap-4 border-t border-[var(--navy-10)] pt-6" aria-live="polite" data-testid="checklist-summary">
        {answeredAllQuestions && needsReview.length === 0 ? (
          <p className="text-[1.0625rem] font-semibold" data-testid="text-checklist-result-all-yes">
            {postChecklistCopy.resultAllYes}
          </p>
        ) : answeredAllQuestions ? (
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
                  <div className="mt-3">
                    <SourceReference
                      url={item.sourceUrl}
                      number={checklistSourceNumbers[item.sourceUrl] ?? 1}
                      testId={`result-source-${item.id}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[1rem] leading-7" data-testid="text-checklist-after-editing">
              {postChecklistCopy.afterEditing}
            </p>
          </div>
        ) : null}
        <button type="button" onClick={() => setAnswers({})} className="secondary-button min-h-11" data-testid="button-reset-checklist">
          {postChecklistCopy.reset}
        </button>
      </section>

      <p className="mt-5 text-sm text-[var(--navy)]/75" data-testid="text-checklist-sources">
        <BidiText text={postChecklistCopy.sources} />
      </p>
    </main>
  );
}
