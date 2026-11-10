import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'wouter';
import { quizFooter, quizIntro, quizSections, type QuizQuestion, type QuizSection } from '@/data/quizContent';
import { BidiText } from '@/components/heraz/BidiText';
import { NextStep } from '@/components/heraz/layout';
import './quiz.css';

type OptionId = 'a' | 'b' | 'c';
type QuestionWithSection = QuizQuestion & {
  sectionId: QuizSection['id'];
  sectionTitle: string;
  sectionRoute: string;
};
type QuizState =
  | { view: 'intro' }
  | { view: 'question'; questionIndex: number; selected: OptionId | null; answers: Record<number, OptionId> }
  | { view: 'result'; answers: Record<number, OptionId>; score: number };

const questions: QuestionWithSection[] = quizSections.flatMap((section) =>
  section.questions.map((question) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionRoute: section.route,
  })),
);
const totalQuestions = questions.length;
const optionLetters: Record<OptionId, string> = { a: 'أ', b: 'ب', c: 'ج' };
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (value: number) => String(value).replace(/\d/g, (digit) => arabicDigits[Number(digit)]!);

function QuizSourceLabel({ label }: { label: string }) {
  const separator = label.indexOf(' — ');
  if (separator < 0) return <BidiText text={label} />;
  const source = label.slice(0, separator);
  const dateOrTitle = label.slice(separator + 3);
  return (
    <>
      <BidiText text={source} />
      <span className="quiz-source-date"> — {dateOrTitle}</span>
    </>
  );
}

export default function QuizPage() {
  const [state, setState] = useState<QuizState>({ view: 'intro' });
  const selectionLocked = useRef(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const activeQuestion = state.view === 'question' ? questions[state.questionIndex] : undefined;
  const confirmed = state.view === 'question' && state.answers[state.questionIndex] !== undefined;

  useEffect(() => {
    if (state.view === 'question') questionHeadingRef.current?.focus();
  }, [state.view, state.view === 'question' ? state.questionIndex : -1]);

  useEffect(() => {
    if (!confirmed) return;
    feedbackRef.current?.focus({ preventScroll: true });
    feedbackRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [confirmed, state.view === 'question' ? state.questionIndex : -1]);

  function beginQuiz() {
    selectionLocked.current = false;
    setState({ view: 'question', questionIndex: 0, selected: null, answers: {} });
  }

  function chooseAnswer(answer: OptionId) {
    if (state.view !== 'question' || confirmed || selectionLocked.current) return;
    setState({ ...state, selected: answer });
  }

  function confirmAnswer() {
    if (state.view !== 'question' || state.selected === null || confirmed || selectionLocked.current) return;
    selectionLocked.current = true;
    setState({
      ...state,
      answers: { ...state.answers, [state.questionIndex]: state.selected },
    });
  }

  function continueQuiz() {
    setState((current) => {
    if (current.view !== 'question' || current.answers[current.questionIndex] === undefined) return current;
    if (current.questionIndex === totalQuestions - 1) {
      const score = questions.reduce(
        (currentScore, question, index) => currentScore + (current.answers[index] === question.correctOption ? 1 : 0),
        0,
      );
      return { view: 'result', answers: current.answers, score };
    }

    const nextIndex = current.questionIndex + 1;
    const nextSelected = current.answers[nextIndex] ?? null;
    selectionLocked.current = nextSelected !== null;
    return { ...current, questionIndex: nextIndex, selected: nextSelected };
    });
  }

  function goBack() {
    if (state.view !== 'question') return;
    if (state.questionIndex === 0) {
      selectionLocked.current = false;
      setState({ view: 'intro' });
      return;
    }
    const previousIndex = state.questionIndex - 1;
    const previousSelected = state.answers[previousIndex] ?? null;
    selectionLocked.current = previousSelected !== null;
    setState({ ...state, questionIndex: previousIndex, selected: previousSelected });
  }

  function restartQuiz() {
    selectionLocked.current = false;
    setState({ view: 'intro' });
  }

  return (
    <main id="main-content" tabIndex={-1} className={`quiz-page${confirmed ? ' has-confirmed-answer' : ''}`} data-testid="page-quiz">
      <div className="quiz-shell">
        <header className="quiz-heading">
          <div className="page-heading-content">
          <p className="page-eyebrow" data-testid="text-page-eyebrow">اختبر وعيك</p>
          <h1 className="quiz-title" data-testid="heading-quiz">اختبر وعيك</h1>
          {state.view === 'intro' && (
            <>
              <p className="quiz-intro" data-testid="text-quiz-intro">{quizIntro}</p>
              <button type="button" className="quiz-action quiz-action-primary quiz-start" onClick={beginQuiz} data-testid="button-start-quiz">
                ابدأ الاختبار
              </button>
            </>
          )}
          </div>
        </header>

        {state.view === 'question' && activeQuestion && (
          <section className="quiz-panel" aria-labelledby="quiz-question-title" data-testid="quiz-question-panel">
            <div className="quiz-step-row">
              <span className="quiz-step-section" data-testid="text-active-section">{activeQuestion.sectionTitle}</span>
              <span className="quiz-step-count" data-testid="text-question-progress">
                السؤال {toArabicDigits(state.questionIndex + 1)} من {toArabicDigits(totalQuestions)}
              </span>
            </div>
            <div
              className="quiz-progress"
              role="progressbar"
              aria-label="تقدم الاختبار"
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
              aria-valuenow={state.questionIndex + 1}
              data-testid="progress-quiz"
            >
              <div className="quiz-progress-fill" style={{ width: `${((state.questionIndex + 1) / totalQuestions) * 100}%` }} />
            </div>
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="quiz-question"
              id="quiz-question-title"
              data-testid={`text-question-${activeQuestion.sectionId}-${state.questionIndex + 1}`}
            >
              <BidiText text={activeQuestion.prompt} />
            </h2>
            <div className="quiz-options" role="group" aria-label="اختر إجابة">
              {activeQuestion.options.map((option) => {
                const selected = state.selected === option.id;
                const isCorrect = option.id === activeQuestion.correctOption;
                const showFeedback = confirmed;
                const className = [
                  'quiz-choice',
                  selected ? 'is-selected' : '',
                  showFeedback && isCorrect ? 'is-correct' : '',
                  showFeedback && selected && !isCorrect ? 'is-chosen-wrong' : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={className}
                    disabled={showFeedback}
                    onClick={() => chooseAnswer(option.id)}
                    aria-pressed={selected}
                    data-testid={`button-answer-${activeQuestion.sectionId}-${state.questionIndex + 1}-${option.id}`}
                  >
                    <span className="quiz-choice-letter" aria-hidden="true">{optionLetters[option.id]}</span>
                    <span className="quiz-choice-text"><BidiText text={option.text} /></span>
                    {showFeedback && isCorrect && (
                      <span className="quiz-correct-option-label">
                        <Check className="quiz-choice-feedback-icon" size={20} aria-hidden="true" />
                        الإجابة الصحيحة
                      </span>
                    )}
                    {showFeedback && selected && !isCorrect && <X className="quiz-choice-feedback-icon" size={20} aria-label="إجابة غير صحيحة" />}
                  </button>
                );
              })}
            </div>
            {!confirmed && (
              <button type="button" className="quiz-action quiz-action-primary quiz-confirm" disabled={state.selected === null} onClick={confirmAnswer} data-testid="button-confirm-answer">
                تأكيد الإجابة
              </button>
            )}
            {confirmed && (
              <div ref={feedbackRef} tabIndex={-1} className={`quiz-feedback ${state.selected === activeQuestion.correctOption ? 'is-correct' : 'is-incorrect'}`} aria-live="polite" role="status" aria-label="نتيجة الإجابة" data-testid="quiz-answer-feedback">
                <p className={`quiz-verdict ${state.selected === activeQuestion.correctOption ? 'is-correct' : 'is-incorrect'}`}>
                  {state.selected === activeQuestion.correctOption
                    ? <><Check size={19} aria-hidden="true" /> إجابة صحيحة</>
                    : <><X size={19} aria-hidden="true" /> إجابة غير صحيحة</>}
                </p>
                <p className="quiz-correction" data-testid="text-answer-correction">
                  <BidiText text={activeQuestion.shortCorrection} />
                </p>
                <div className="quiz-feedback-actions">
                  <a
                    className="quiz-action quiz-source"
                    href={activeQuestion.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-source-${activeQuestion.sectionId}-${state.questionIndex + 1}`}
                  >
                    <QuizSourceLabel label={activeQuestion.sourceLabel} />
                  </a>
                  <Link href={activeQuestion.sectionRoute} className="quiz-action" data-testid={`link-return-${activeQuestion.sectionId}-${state.questionIndex + 1}`}>
                    ارجع إلى الصفحة
                  </Link>
                </div>
              </div>
            )}
            {confirmed && (
              <div className="quiz-next-bar">
                <button type="button" className="quiz-action quiz-action-primary quiz-next" onClick={continueQuiz} data-testid="button-next-question">
                  {state.questionIndex === totalQuestions - 1 ? 'عرض النتيجة' : 'التالي'}
                </button>
              </div>
            )}
            <button type="button" className="quiz-back-link" onClick={goBack} data-testid="button-quiz-back">
              السابق
            </button>
          </section>
        )}

        {state.view === 'result' && (
          <section className="quiz-panel quiz-result" aria-live="polite" data-testid="quiz-result">
            <p className="quiz-result-score" data-testid="text-quiz-score">
              {toArabicDigits(state.score)} من {toArabicDigits(totalQuestions)}
            </p>
            <p className="quiz-kicker">اختبر وعيك</p>
            <h2 className="quiz-result-title" data-testid="text-result-copy">
              {state.score === totalQuestions
                ? 'أحسنت. حافظ على هذه الممارسات وراجعها مع أسرتك.'
                : state.score >= Math.ceil(totalQuestions / 2)
                  ? 'بداية جيدة. راجع تفسيرات الإجابات التي أخطأت فيها ثم أعد الاختبار.'
                  : 'راجع صفحات التوعية وتفسيرات الإجابات، ثم أعد الاختبار.'}
            </h2>
            <div className="quiz-result-actions">
              <Link href="/protect" className="quiz-action" data-testid="link-result-protect">احمِ</Link>
              <button type="button" className="quiz-action quiz-action-primary" onClick={restartQuiz} data-testid="button-restart-quiz">
                إعادة الاختبار
              </button>
            </div>
          </section>
        )}

        {state.view !== 'result' && <p className="quiz-footer-note" data-testid="text-quiz-footer">{quizFooter}</p>}
        {state.view === 'result' && <NextStep path="/quiz" showQuizResult />}
      </div>
    </main>
  );
}
