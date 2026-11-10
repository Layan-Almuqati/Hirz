import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { BidiText } from '@/components/heraz/BidiText';
import { sources } from '@/data/sources';

const groupedSources = sources.reduce<Record<string, typeof sources>>((groups, source) => {
  (groups[source.page] ??= []).push(source);
  return groups;
}, {});

export default function SourcesPage() {
  const [location] = useLocation();
  const [highlightedId, setHighlightedId] = useState('');

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const row = document.getElementById(id);
    if (!row) return;
    setHighlightedId(id);
    const firstFrame = window.requestAnimationFrame(() => row.scrollIntoView({ block: 'start', behavior: 'auto' }));
    const timeout = window.setTimeout(() => setHighlightedId(''), 2000);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeout);
    };
  }, [location]);

  return (
    <main id="main-content" tabIndex={-1} className="page-wrap sources-page py-10 md:py-14" data-testid="page-sources">
      <header className="mb-8 page-heading-band sources-heading-band">
        <div className="page-heading-content">
        <h1 className="section-title mb-0" data-testid="heading-sources">المصادر</h1>
        </div>
      </header>
      {Object.entries(groupedSources).map(([page, items]) => (
        <section className="sources-group" key={page} aria-labelledby={`sources-group-${page}`}>
          <h2 id={`sources-group-${page}`} className="sources-group-title">{page}</h2>
          <div className="sources-list">
            {items.map((source) => (
              <article
                id={source.id}
                className={`source-row ${highlightedId === source.id ? 'is-hash-highlight' : ''}`}
                key={source.id}
                data-testid={`source-row-${source.id}`}
              >
                <div className="source-row-copy">
                  <h3 className="source-row-title"><BidiText text={source.title} /></h3>
                  <p className="source-row-meta">
                    <BidiText text={source.publisher} />
                    {source.year && <><span aria-hidden="true"> · </span><bdi dir="ltr">{source.year}</bdi></>}
                  </p>
                  {source.lastChecked && (
                    <p className="source-row-checked">آخر تحقق: <bdi dir="ltr">{source.lastChecked}</bdi></p>
                  )}
                </div>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="secondary-button source-row-link">
                  <BidiText text="فتح المصدر" />
                </a>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
