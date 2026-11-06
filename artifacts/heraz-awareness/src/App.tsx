import { type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/home';
import BeforeYouPostPage from '@/pages/before-you-post';
import HelpPage from '@/pages/help';
import PlaceholderPage from '@/pages/placeholder';
import RisksPage from '@/pages/risks';
import ProtectPage from '@/pages/protect';
import QuizPage from '@/pages/quiz';
import { Footer, Navbar, UtilityBar } from '@/components/heraz/layout';
import AboutPage from '@/pages/about';
import PrivacyPage from '@/pages/privacy';
import BackToTopButton from '@/components/heraz/back-to-top';
import { aboutContent } from '@/data/aboutContent';

const pages = [
  { path: '/', label: 'الرئيسية' },
  { path: '/understand', label: 'افهم' },
  { path: '/risks', label: 'المخاطر' },
  { path: '/before-you-post', label: 'قبل أن تنشر' },
  { path: '/protect', label: 'احمِ' },
  { path: '/laws', label: 'التشريعات' },
  { path: '/quiz', label: 'اختبر وعيك' },
  { path: '/kids', label: 'عالم حرز' },
];

function Shell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-[100dvh]">
      <a className="skip-link" href="#main-content" data-testid="link-skip-content">انتقل إلى المحتوى</a>
      <UtilityBar />
      <Navbar />
      {children}
      <Footer pages={pages} aboutLink={{ path: '/about', label: aboutContent.title }} />
      <BackToTopButton />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Shell>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/understand"><PlaceholderPage pageKey="understand" /></Route>
          <Route path="/risks" component={RisksPage} />
          <Route path="/before-you-post" component={BeforeYouPostPage} />
          <Route path="/protect/help" component={HelpPage} />
          <Route path="/protect" component={ProtectPage} />
          <Route path="/laws"><PlaceholderPage pageKey="laws" /></Route>
          <Route path="/quiz" component={QuizPage} />
          <Route path="/kids"><PlaceholderPage pageKey="kids" /></Route>
          <Route>
            <main id="main-content" tabIndex={-1} className="page-wrap py-20">
              <NotFound />
              <Link href="/" data-testid="link-not-found-home" className="primary-button mt-6">العودة للرئيسية</Link>
            </main>
          </Route>
        </Switch>
      </Shell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
