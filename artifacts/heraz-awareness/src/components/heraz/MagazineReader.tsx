import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type PointerEvent } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import './magazine-reader.css';

const totalPages = 16;
type AudioStatus = 'idle' | 'playing' | 'paused' | 'finished';

function getPageImageSrc(index: number) {
  return `${import.meta.env.BASE_URL}kids-magazine/page-${String(index + 1).padStart(2, '0')}.webp`;
}

function getStoryAudioSrc(index: number) {
  const fileName = index === 6 ? 'story-1.mp3' : index === 8 ? 'story-2.mp3' : null;
  return fileName ? `${import.meta.env.BASE_URL}assets/audio/${fileName}` : null;
}

function readToggle(key: string, fallback: boolean) {
  try {
    const stored = window.sessionStorage.getItem(key);
    return stored === null ? fallback : stored === 'true';
  } catch {
    return fallback;
  }
}

function writeToggle(key: string, value: boolean) {
  try {
    window.sessionStorage.setItem(key, String(value));
  } catch {
    // Session storage may be unavailable in restricted browsing modes.
  }
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const totalSeconds = Math.floor(seconds);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

function MagazineReader() {
  const [pageIndex, setPageIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => readToggle('heraz-magazine-page-sound', true));
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDurations, setAudioDurations] = useState<Record<number, number>>({});
  const [failedAudioPages, setFailedAudioPages] = useState<Set<number>>(() => new Set());
  const [dismissedHintPages, setDismissedHintPages] = useState<Set<number>>(() => new Set());
  const [hintVisible, setHintVisible] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'previous'>('next');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedAudioPage = useRef<number | null>(null);
  const reportedAudioErrors = useRef<Set<number>>(new Set());
  const audioContext = useRef<AudioContext | null>(null);
  const audioUnlocked = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const storyAudioSrc = getStoryAudioSrc(pageIndex);
  const isStoryPage = storyAudioSrc !== null;
  const audioFailed = failedAudioPages.has(pageIndex);
  const canReadStory = isStoryPage && !audioFailed;
  const duration = audioDurations[pageIndex] ?? 0;
  const remainingTime = Math.max(0, duration - audioCurrentTime);

  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current) return;
    const AudioContextConstructor = window.AudioContext
      ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextConstructor) {
      const context = audioContext.current ?? new AudioContextConstructor();
      audioContext.current = context;
      if (context.state === 'suspended') void context.resume();
    }
    audioUnlocked.current = true;
  }, []);

  const playFlipSound = useCallback(() => {
    if (!soundEnabled || !audioUnlocked.current) return;
    const context = audioContext.current;
    if (!context) return;
    if (context.state === 'suspended') void context.resume();
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.12), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let sample = 0; sample < channel.length; sample += 1) {
      channel[sample] = (Math.random() * 2 - 1) * (1 - sample / channel.length);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 1350;
    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + 0.12);
  }, [soundEnabled]);

  const resetStoryAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // The media may not have loaded metadata yet.
      }
    }
    setAudioCurrentTime(0);
    setAudioStatus('idle');
  }, []);

  const reportAudioFailure = useCallback((page: number, audio: HTMLAudioElement) => {
    if (!reportedAudioErrors.current.has(page)) {
      reportedAudioErrors.current.add(page);
      console.error('Story audio failed to load.', audio.currentSrc, audio.error);
    }
    setFailedAudioPages((current) => new Set(current).add(page));
    audio.pause();
    setAudioCurrentTime(0);
    setAudioStatus('idle');
  }, []);

  const playStoryAudio = useCallback(() => {
    const audio = audioRef.current;
    const source = getStoryAudioSrc(pageIndex);
    if (!audio || !source || failedAudioPages.has(pageIndex)) return;

    if (audio.src !== new URL(source, window.location.href).href) {
      audio.pause();
      audio.preload = 'metadata';
      audio.src = source;
      loadedAudioPage.current = pageIndex;
      audio.load();
    }

    if (audio.ended || audioStatus === 'finished') {
      audio.currentTime = 0;
      setAudioCurrentTime(0);
    }

    void audio.play().then(() => {
      setDismissedHintPages((current) => new Set(current).add(pageIndex));
      setHintVisible(false);
    }).catch(() => {
      if (audio.error) reportAudioFailure(pageIndex, audio);
    });
  }, [audioStatus, failedAudioPages, pageIndex, reportAudioFailure]);

  const toggleStoryAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !getStoryAudioSrc(pageIndex) || failedAudioPages.has(pageIndex)) return;
    if (!audio.paused && !audio.ended) {
      audio.pause();
      return;
    }
    playStoryAudio();
  }, [failedAudioPages, pageIndex, playStoryAudio]);

  const turnPage = useCallback((direction: 'next' | 'previous') => {
    const nextIndex = pageIndex + (direction === 'next' ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= totalPages) return;
    resetStoryAudio();
    playFlipSound();
    setTransitionDirection(direction);
    setPageIndex(nextIndex);
  }, [pageIndex, playFlipSound, resetStoryAudio]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, button, [contenteditable="true"]')) return;
      event.preventDefault();
      turnPage(event.key === 'ArrowLeft' ? 'next' : 'previous');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPage]);

  useEffect(() => {
    [pageIndex - 1, pageIndex + 1].forEach((index) => {
      if (index < 0 || index >= totalPages) return;
      const image = new Image();
      image.src = getPageImageSrc(index);
    });
  }, [pageIndex]);

  useEffect(() => {
    if (!isStoryPage || audioFailed || dismissedHintPages.has(pageIndex)) {
      setHintVisible(false);
      return;
    }
    setHintVisible(true);
    const hintTimer = window.setTimeout(() => {
      setHintVisible(false);
      setDismissedHintPages((current) => new Set(current).add(pageIndex));
    }, 6000);
    return () => window.clearTimeout(hintTimer);
  }, [audioFailed, dismissedHintPages, isStoryPage, pageIndex]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') resetStoryAudio();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [resetStoryAudio]);

  useEffect(() => {
    const mountedAudio = audioRef.current;
    return () => {
      if (mountedAudio) {
        mountedAudio.pause();
        try {
          mountedAudio.currentTime = 0;
        } catch {
          // The media may not have loaded metadata yet.
        }
      }
      void audioContext.current?.close();
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    unlockAudio();
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY)) {
      turnPage(deltaX < 0 ? 'next' : 'previous');
    }
  };

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setAudioCurrentTime(audio.currentTime);
  };

  const handleAudioMetadata = () => {
    const audio = audioRef.current;
    const page = loadedAudioPage.current;
    if (!audio || page === null || !Number.isFinite(audio.duration)) return;
    setAudioDurations((current) => ({ ...current, [page]: audio.duration }));
  };

  const handleAudioError = () => {
    const audio = audioRef.current;
    const page = loadedAudioPage.current;
    if (!audio || page === null) return;
    reportAudioFailure(page, audio);
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(event.currentTarget.value);
    if (!audio || !Number.isFinite(nextTime)) return;
    audio.currentTime = nextTime;
    setAudioCurrentTime(nextTime);
  };

  const buttonLabel = audioStatus === 'playing' ? 'إيقاف الحكاية مؤقتًا' : 'تشغيل الحكاية';
  const playerLabel = audioStatus === 'playing'
    ? 'جاري القراءة...'
    : audioStatus === 'paused'
      ? 'تم إيقاف القراءة مؤقتًا'
      : audioStatus === 'finished'
        ? 'أعد الاستماع'
        : 'اضغط على القصة لتسمعها';

  return (
    <section
      className="magazine-reader"
      aria-label="مجلة درع المستقبل"
      onPointerDownCapture={unlockAudio}
      data-testid="magazine-reader"
    >
      <div className="magazine-reader-toolbar" dir="rtl">
        <label className="magazine-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(event) => {
              setSoundEnabled(event.target.checked);
              writeToggle('heraz-magazine-page-sound', event.target.checked);
            }}
            data-testid="toggle-page-sound"
          />
          <span className="magazine-switch" aria-hidden="true" />
          <span>الصوت</span>
        </label>
      </div>

      <div
        className="magazine-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
        data-testid="magazine-page-stage"
      >
        <div className="magazine-page-frame">
          <img
            key={pageIndex}
            className={`magazine-page magazine-page-${transitionDirection}${audioStatus === 'playing' && canReadStory ? ' magazine-page-audio-playing' : ''}`}
            src={getPageImageSrc(pageIndex)}
            alt={`صفحة ${pageIndex + 1} من ${totalPages}`}
            width="579"
            height="819"
            loading="eager"
            decoding="async"
            draggable={false}
            data-testid={`magazine-page-image-${pageIndex + 1}`}
          />
          {canReadStory ? (
            <button
              type="button"
              className="magazine-story-tap-area"
              onClick={toggleStoryAudio}
              aria-label={buttonLabel}
              aria-pressed={audioStatus === 'playing'}
              data-testid={`button-story-tap-page-${pageIndex + 1}`}
            />
          ) : null}
        </div>
      </div>

      {isStoryPage ? (
        <>
          <p
            className={`magazine-audio-hint${hintVisible && !dismissedHintPages.has(pageIndex) ? ' is-visible' : ''}`}
            aria-hidden="true"
            data-testid={`hint-story-page-${pageIndex + 1}`}
          >اضغط على القصة لتسمعها</p>
          <div className="magazine-audio-player" dir="rtl" data-testid={`player-story-page-${pageIndex + 1}`}>
            <button
              type="button"
              className="magazine-audio-play-button"
              onClick={toggleStoryAudio}
              disabled={audioFailed}
              aria-label={buttonLabel}
              aria-pressed={audioStatus === 'playing'}
              data-testid="button-story-audio"
            >
              {audioStatus === 'finished' ? (
                <RotateCcw size={25} strokeWidth={2.3} aria-hidden="true" />
              ) : audioStatus === 'playing' ? (
                <Pause size={27} fill="currentColor" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Play size={27} fill="currentColor" strokeWidth={2} aria-hidden="true" />
              )}
            </button>
            <span className="magazine-audio-status" aria-live="polite" data-testid="status-story-audio">
              {playerLabel}
            </span>
            <input
              type="range"
              className="magazine-audio-progress"
              min={0}
              max={Math.max(duration, 1)}
              step={0.1}
              value={Math.min(audioCurrentTime, Math.max(duration, 1))}
              onChange={handleProgressChange}
              disabled={!duration || audioFailed}
              style={{ '--progress': `${duration > 0 ? Math.min(100, (audioCurrentTime / duration) * 100) : 0}%` } as CSSProperties}
              aria-label="تقدم قراءة الحكاية"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(audioCurrentTime)}
              aria-valuetext={formatTime(audioCurrentTime)}
              role="slider"
              data-testid="slider-story-audio-progress"
            />
            <span className="magazine-audio-time" dir="ltr" aria-label="الوقت المتبقي">
              {formatTime(remainingTime)}
            </span>
          </div>
        </>
      ) : null}

      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioMetadata}
        onPlay={() => setAudioStatus('playing')}
        onPause={() => {
          const audio = audioRef.current;
          if (audio?.ended) return;
          setAudioStatus(audio && audio.currentTime > 0 ? 'paused' : 'idle');
        }}
        onEnded={() => {
          const audio = audioRef.current;
          if (audio) setAudioCurrentTime(audio.duration);
          setAudioStatus('finished');
        }}
        onError={handleAudioError}
        aria-hidden="true"
      />

      <p className="magazine-page-counter" dir="ltr" aria-live="polite" data-testid="magazine-page-counter">
        {pageIndex + 1} / {totalPages}
      </p>

      <div className="magazine-reader-controls" dir="rtl">
        <button
          type="button"
          className="magazine-nav-button"
          onClick={() => turnPage('previous')}
          disabled={pageIndex === 0}
          data-testid="button-magazine-previous"
        >السابقة</button>
        <button
          type="button"
          className="magazine-nav-button"
          onClick={() => turnPage('next')}
          disabled={pageIndex === totalPages - 1}
          data-testid="button-magazine-next"
        >التالية</button>
      </div>
    </section>
  );
}

export default MagazineReader;
