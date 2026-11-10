import { Link } from 'wouter';
import { findSourceById, findSourceByUrl } from '@/data/sources';
import { toArabicIndic } from '@/lib/utils';

export function SourceMarker({ sourceId, number, testId }: { sourceId: string; number: number; testId?: string }) {
  const source = findSourceById(sourceId);
  if (!source) {
    if (import.meta.env.DEV) console.error(`Missing sourceId in sources.ts: ${sourceId}`);
    return null;
  }
  const labelNumber = toArabicIndic(number);
  return (
    <Link
      href={`/sources#${source.id}`}
      className="source-marker"
      aria-label={`المصدر ${labelNumber}`}
      data-testid={testId ?? `source-marker-${source.id}-${number}`}
    >
      [{labelNumber}]
    </Link>
  );
}

export function SourceReference({ url, number, testId }: { url: string; number: number; testId?: string }) {
  const source = findSourceByUrl(url);
  if (!source) {
    if (import.meta.env.DEV) console.error(`Missing sourceId in sources.ts: ${url}`);
    return null;
  }
  return <SourceMarker sourceId={source.id} number={number} testId={testId} />;
}
