'use client';

import { useState, useCallback, useEffect } from 'react';
import { DeckConfig } from '@/types/slides';
import SlideRenderer from '@/components/SlideRenderer';
import SlideControls from '@/components/SlideControls';
import EmbedCollector, { EmbedEntry } from '@/components/EmbedCollector';
import ClientProfileManager from '@/components/ClientProfileManager';
import DemoCopilot from '@/components/DemoCopilot';
import ProfileManager from '@/components/ProfileManager';
import PreFlightChecklist from '@/components/PreFlightChecklist';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSyncSlide } from '@/hooks/useSyncSlide';
import slidesData from '@/data/slides.json';

const initialEmbeds: EmbedEntry[] = [
  {
    id: 'product-portal',
    title: 'Product portal',
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    notes: 'Keep documentation open for the story.',
    aspectRatio: '16/9',
  },
  {
    id: 'design-system',
    title: 'Design system',
    url: 'https://tailwindcss.com/docs/installation',
    notes: 'Show off UI guidelines or component libraries.',
    aspectRatio: '4/3',
  },
];

export default function Home() {
  const deck = slidesData as DeckConfig;
  const [currentSlide, setCurrentSlide] = useSyncSlide(0);
  const [showUI, setShowUI] = useState(true);

  const totalSlides = deck.slides.length;

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  }, [totalSlides]);

  const openPresenter = useCallback(() => {
    window.open('/presenter', '_blank', 'width=1200,height=800');
  }, []);

  useKeyboardNav({ onNext: goNext, onPrev: goPrev, onPresenter: openPresenter });

  useEffect(() => {
    const handleMouseMove = () => {
      setShowUI(true);
    };

    let timeout: NodeJS.Timeout;
    const handleIdle = () => {
      timeout = setTimeout(() => setShowUI(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleIdle();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const slide = deck.slides[currentSlide];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
        <section className="space-y-6">
          <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-black/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Workspace</p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{deck.name}</h1>
              {deck.author && (
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">By {deck.author}</p>
              )}
            </div>
            <button
              onClick={openPresenter}
              className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Presenter view
            </button>
          </header>

          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-black/10">
            <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950/90 p-5">
              <div className="relative aspect-[16/9] w-full">
                <div className="absolute inset-0">
                  <SlideRenderer slide={slide} isActive onNavigate={goTo} />
                </div>
              </div>
              <div className="mt-4">{deck.author ? <p className="text-xs text-slate-400">{deck.author}</p> : null}</div>
            </div>
            <div className={`transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
              <SlideControls
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                onPrev={goPrev}
                onNext={goNext}
                onGoTo={goTo}
                className="mx-auto max-w-3xl"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 flex flex-col gap-6">
            <ProfileManager />
            <ClientProfileManager />
            <PreFlightChecklist />
          </div>
          <div className="md:col-span-8">
            <EmbedCollector initialEntries={initialEmbeds} />
          </div>
        </div>

        <DemoCopilot currentSlideData={slide} />
      </div>
    </div>
  );
}
