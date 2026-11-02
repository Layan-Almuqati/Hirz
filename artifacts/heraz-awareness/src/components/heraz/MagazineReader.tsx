import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import magazineNarration from '@/data/magazineNarration';
import './magazine-reader.css';

const totalPages = 16;
const soundStorageKey = 'heraz-magazine-page-sound';
const autoReadStorageKey = 'heraz-magazine-auto-read';

function getPageImageSrc(index: number) {
  return `${import.meta.env.BASE_URL}kids-magazine/page-${String(index + 1).padStart(2, '0')}.webp`;
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

function MagazineReader() {
  const [pageIndex, setPageIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => readToggle(soundStorageKey, true));
  const [autoRead, setAutoRead] = useState(() => readToggle(autoReadStorageKey, false));
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'previous'>('next');
  const audioContext = useRef<AudioContext | null>(null);
  const audioUnlocked = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const pendingAutoReadPage = useRef<number | null>(null);
  const speechGeneration = useRef(0);

  const arabicVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('ar-sa'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('ar'));
  const narration = magazineNarration[pageIndex];

  const cancelSpeech = useCallback(() => {
    speechGeneration.current += 1;
    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speakCurrentPage = useCallback(() => {
    if (!arabicVoice || typeof window.speechSynthesis === 'undefined') return;
    const generation = speechGeneration.current + 1;
    speechGeneration.current = generation;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'ar-SA';
    utterance.voice = arabicVoice;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => {
      if (speechGeneration.current === generation) setSpeaking(true);
    };
    utterance.onend = () => {
      if (speechGeneration.current === generation) setSpeaking(false);
    };
    utterance.onerror = () => {
      if (speechGeneration.current === generation) setSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [arabicVoice, narration]);

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

  const turnPage = useCallback((direction: 'next' | 'previous') => {
    const nextIndex = pageIndex + (direction === 'next' ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= totalPages) return;
    pendingAutoReadPage.current = autoRead ? nextIndex : null;
    cancelSpeech();
    playFlipSound();
    setTransitionDirection(direction);
    setPageIndex(nextIndex);
  }, [autoRead, cancelSpeech, pageIndex, playFlipSound]);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setVoicesReady(true);
    };
    if (typeof window.speechSynthesis === 'undefined') {
      setVoicesReady(true);
      return;
    }
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    const fallbackTimer = window.setTimeout(() => setVoicesReady(true), 600);
    return () => {
      window.clearTimeout(fallbackTimer);
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
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
    if (!autoRead) {
      pendingAutoReadPage.current = null;
      return;
    }
    if (pendingAutoReadPage.current !== pageIndex || !voicesReady) return;
    if (arabicVoice) speakCurrentPage();
    pendingAutoReadPage.current = null;
  }, [autoRead, arabicVoice, pageIndex, speakCurrentPage, voicesReady]);

  useEffect(() => () => {
    speechGeneration.current += 1;
    if (typeof window.speechSynthesis !== 'undefined') window.speechSynthesis.cancel();
    void audioContext.current?.close();
  }, []);

  const startTouch = (event: TouchEvent<HTMLDivElement>) => {
    unlockAudio();
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const endTouch = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 42) turnPage(delta < 0 ? 'next' : 'previous');
    touchStartX.current = null;
  };

  const voiceUnavailable = voicesReady && !arabicVoice;

  return (
    <section
      className="magazine-reader"
      aria-label="مجلة درع المستقبل"
      onPointerDownCapture={unlockAudio}
      onClickCapture={unlockAudio}
      data-testid="magazine-reader"
    >
      <div className="magazine-reader-toolbar" dir="rtl">
        <label className="magazine-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(event) => {
              setSoundEnabled(event.target.checked);
              writeToggle(soundStorageKey, event.target.checked);
            }}
            data-testid="toggle-page-sound"
          />
          <span className="magazine-switch" aria-hidden="true" />
          <span>الصوت</span>
        </label>
        {voicesReady && arabicVoice && (
          <label className="magazine-toggle">
            <input
              type="checkbox"
              checked={autoRead}
              onChange={(event) => {
                setAutoRead(event.target.checked);
                writeToggle(autoReadStorageKey, event.target.checked);
                if (!event.target.checked) cancelSpeech();
              }}
              data-testid="toggle-auto-read"
            />
            <span className="magazine-switch" aria-hidden="true" />
            <span>قراءة تلقائية</span>
          </label>
        )}
      </div>

      <div
        className="magazine-stage"
        onTouchStart={startTouch}
        onTouchEnd={endTouch}
        data-testid="magazine-page-stage"
      >
        <img
          key={pageIndex}
          className={`magazine-page magazine-page-${transitionDirection}`}
          src={getPageImageSrc(pageIndex)}
          alt={narration}
          width="1076"
          height="1521"
          loading="eager"
          decoding="async"
          draggable={false}
          data-testid={`magazine-page-image-${pageIndex + 1}`}
        />
      </div>

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

      {voiceUnavailable ? (
        <p className="magazine-voice-unavailable" data-testid="status-voice-unavailable">القراءة الصوتية غير متاحة على هذا الجهاز.</p>
      ) : voicesReady && arabicVoice ? (
        <div className="magazine-listen-row">
          <button
            type="button"
            className="magazine-listen-button"
            onClick={speaking ? cancelSpeech : speakCurrentPage}
            data-testid="button-magazine-listen"
          >{speaking ? '⏹ إيقاف' : '🔊 اسمعني'}</button>
        </div>
      ) : null}
    </section>
  );
}

export default MagazineReader;
