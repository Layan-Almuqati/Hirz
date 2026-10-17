import { type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/home';
import HelpPage from '@/pages/help';
import PlaceholderPage from '@/pages/placeholder';
import { Footer, Navbar } from '@/components/heraz/layout';

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
      <Navbar />
      {children}
      <Footer pages={pages} />
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
          <Route path="/understand"><PlaceholderPage pageKey="understand" /></Route>
          <Route path="/risks"><PlaceholderPage pageKey="risks" /></Route>
          <Route path="/before-you-post"><PlaceholderPage pageKey="before-you-post" /></Route>
          <Route path="/protect/help" component={HelpPage} />
          <Route path="/protect"><PlaceholderPage pageKey="protect" /></Route>
          <Route path="/laws"><PlaceholderPage pageKey="laws" /></Route>
          <Route path="/quiz"><PlaceholderPage pageKey="quiz" /></Route>
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
