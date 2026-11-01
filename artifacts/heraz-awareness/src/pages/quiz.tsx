import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { quizFooter, quizIntro, quizSections, type QuizSection } from '@/data/quizContent';
import './quiz.css';

type ResultMap = Record<string, number>;
type QuizState =
  | { view: 'hub' }
  | { view: 'question'; sectionId: QuizSection['id']; questionIndex: number; selected: 'a' | 'b' | 'c' | null; score: number }
  | { view: 'result'; sectionId: QuizSection['id']; score: number };

const RESULTS_KEY = 'heraz-quiz-section-results';

function readResults(): ResultMap {
  try {
    const stored = sessionStorage.getItem(RESULTS_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as ResultMap;
  } catch {
    return {};
  }
}

function clearResultsOnHardReload() {
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === 'reload') sessionStorage.removeItem(RESULTS_KEY);
  } catch {
    // Storage may be unavailable; the quiz remains usable without persistence.
  }
}

function QuizPage() {
  const [results, setResults] = useState<ResultMap>(() => {
    clearResultsOnHardReload();
    return readResults();
  });
  const [state, setState] = useState<QuizState>({ view: 'hub' });

  useEffect(() => {
    try {
      sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    } catch {
      // Results remain in memory if browser storage is unavailable.
    }
  }, [results]);

  const currentSection = state.view === 'hub' ? undefined : quizSections.find((section) => section.id === state.sectionId);

  function beginSection(section: QuizSection) {
    setState({ view: 'question', sectionId: section.id, questionIndex: 0, selected: null, score: 0 });
  }

  function chooseAnswer(answer: 'a' | 'b' | 'c') {
    if (state.view !== 'question' || state.selected !== null) return;
    setState({ ...state, selected: answer });
  }

  function continueSection() {
    if (state.view !== 'question' || !currentSection || state.selected === null) return;
    const question = currentSection.questions[state.questionIndex];
    const nextScore = state.score + (state.selected === question.correctOption ? 1 : 0);
    if (state.questionIndex === 2) {
      const nextResults = { ...results, [state.sectionId]: nextScore };
      setResults(nextResults);
      setState({ view: 'result', sectionId: state.sectionId, score: nextScore });
      return;
    }
    setState({ ...state, questionIndex: state.questionIndex + 1, selected: null, score: nextScore });
  }

  function retrySection() {
    if (state.view !== 'result') return;
    const section = quizSections.find((item) => item.id === state.sectionId);
    if (section) beginSection(section);
  }

  const section = currentSection;
  const activeQuestion = state.view === 'question' && section ? section.questions[state.questionIndex] : undefined;
  const resultScore = state.view === 'result' ? state.score : undefined;

  return (
    <main id="main-content" tabIndex={-1} className="quiz-page" data-testid="page-quiz">
      <div className="quiz-shell">
        <header className="quiz-heading">
          <h1 className="quiz-title" data-testid="heading-quiz">اختبر وعيك</h1>
          <p className="quiz-intro" data-testid="text-quiz-intro">{quizIntro}</p>
        </header>

        {state.view === 'hub' && (
          <section aria-label="أقسام الاختبار" className="quiz-hub" data-testid="quiz-section-hub">
            {quizSections.map((item) => (
              <button
                type="button"
                className="quiz-section-card"
                key={item.id}
                onClick={() => beginSection(item)}
                data-testid={`button-start-section-${item.id}`}
              >
                {results[item.id] !== undefined && <span className="quiz-card-status">اكتمل القسم</span>}
                <span className="quiz-card-title">{item.title}</span>
                <span className="quiz-card-goal">{item.goal}</span>
                {results[item.id] !== undefined && (
                  <span className="quiz-card-result" data-testid={`text-section-result-${item.id}`}>
                    {results[item.id]} / 3 · {results[item.id] === 3
                      ? 'أحسنت. هذا القسم تمام.'
                      : results[item.id] >= 1
                        ? 'قريب. راجع صفحة هذا القسم ثم أعد المحاولة.'
                        : 'هذا القسم يستحق قراءة هادئة. ابدأ من صفحته.'}
                  </span>
                )}
              </button>
            ))}
          </section>
        )}

        {state.view === 'question' && section && activeQuestion && (
          <section className="quiz-panel" aria-labelledby="quiz-question-title" data-testid="quiz-question-panel">
            <div className="quiz-step-row">
              <span className="quiz-step-section" data-testid="text-active-section">{section.title}</span>
              <span className="quiz-step-count" data-testid="text-question-progress">السؤال {state.questionIndex + 1} من 3</span>
            </div>
            <div className="quiz-progress" aria-hidden="true">
              <div className="quiz-progress-fill" style={{ width: `${((state.questionIndex + 1) / 3) * 100}%` }} />
            </div>
            <h2 className="quiz-question" id="quiz-question-title" data-testid={`text-question-${section.id}-${state.questionIndex + 1}`}>
              {activeQuestion.prompt}
            </h2>
            <div className="quiz-options" role="group" aria-label="اختر إجابة">
              {activeQuestion.options.map((option) => {
                const selected = state.selected === option.id;
                const isCorrect = option.id === activeQuestion.correctOption;
                const className = [
                  'quiz-choice',
                  state.selected !== null && isCorrect ? 'is-correct' : '',
                  selected && !isCorrect ? 'is-chosen-wrong' : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={className}
                    disabled={state.selected !== null}
                    onClick={() => chooseAnswer(option.id)}
                    aria-pressed={selected}
                    data-testid={`button-answer-${section.id}-${state.questionIndex + 1}-${option.id}`}
                  >
                    <span className="quiz-choice-letter" aria-hidden="true">{option.id}</span>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>
            {state.selected !== null && (
              <div className="quiz-feedback" aria-live="polite" role="status" data-testid="quiz-answer-feedback">
                <p className="quiz-feedback-title">الجواب الصحيح</p>
                <p className="quiz-correction" data-testid="text-answer-correction">{activeQuestion.correction}</p>
                <div className="quiz-feedback-actions">
                  <a
                    className="quiz-action quiz-source"
                    href={activeQuestion.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-source-${section.id}-${state.questionIndex + 1}`}
                  >
                    {activeQuestion.sourceLabel}
                  </a>
                  <Link href={section.route} className="quiz-action" data-testid={`link-return-${section.id}-${state.questionIndex + 1}`}>
                    ارجع إلى الصفحة
                  </Link>
                  <button type="button" className="quiz-action quiz-action-primary" onClick={continueSection} data-testid="button-next-question">
                    التالي
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {state.view === 'result' && section && resultScore !== undefined && (
          <section className="quiz-panel quiz-result" aria-live="polite" data-testid={`quiz-result-${section.id}`}>
            <span className="quiz-result-mark" aria-hidden="true">{resultScore}/3</span>
            <p className="quiz-kicker">{section.title}</p>
            <h2 className="quiz-result-title" data-testid={`text-result-copy-${section.id}`}>
              {resultScore === 3
                ? 'أحسنت. هذا القسم تمام.'
                : resultScore >= 1
                  ? 'قريب. راجع صفحة هذا القسم ثم أعد المحاولة.'
                  : 'هذا القسم يستحق قراءة هادئة. ابدأ من صفحته.'}
            </h2>
            <div className="quiz-result-actions">
              {resultScore !== 3 && (
                <Link href={section.route} className="quiz-action" data-testid={`link-result-return-${section.id}`}>
                  ارجع إلى الصفحة
                </Link>
              )}
              {resultScore > 0 && (
                <button type="button" className="quiz-action quiz-action-primary" onClick={retrySection} data-testid={`button-retry-${section.id}`}>
                  أعد القسم
                </button>
              )}
            </div>
          </section>
        )}

        <p className="quiz-footer-note" data-testid="text-quiz-footer">{quizFooter}</p>
        {state.view !== 'hub' && (
          <button type="button" className="quiz-back-link" onClick={() => setState({ view: 'hub' })} data-testid="button-back-to-sections">
            العودة إلى الأقسام
          </button>
        )}
      </div>
    </main>
  );
}

export default QuizPage;
