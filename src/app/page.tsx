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
import SlideNotesEditor from '@/components/SlideNotesEditor';
import FeaturePlaylist from '@/components/FeaturePlaylist';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSyncSlide } from '@/hooks/useSyncSlide';
import ancDemoData from '@/data/anc-demo.json';

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
  const deck = ancDemoData as unknown as DeckConfig;
  const [currentSlide, setCurrentSlide] = useSyncSlide(0);
  const [showUI, setShowUI] = useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

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
    <div className="flex h-screen w-full flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Header - Stays fixed at top */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 shadow-sm z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className={`rounded-lg p-2 transition-colors ${showLeftSidebar ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Toggle Feature Playlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-0.5 leading-none">Workspace</p>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white leading-none">{deck.name}</h1>
                {deck.author && (
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
                    By {deck.author}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openPresenter}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-indigo-500 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            Open Presenter View
          </button>
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className={`rounded-lg p-2 transition-colors ${showRightSidebar ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
            title="Toggle AI Copilot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area - 3 Rigid Panes */}
      <div className="flex flex-1 overflow-hidden">

        {/* 1. Left Sidebar (Profiles & Pre-Flight) */}
        {showLeftSidebar && (
          <div className="flex w-[320px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-800 bg-slate-950 p-6 z-10 custom-scrollbar transition-all">
            <FeaturePlaylist slides={deck.slides} currentIndex={currentSlide} onSelect={goTo} />
            <div className="h-px w-full bg-slate-800 my-2" />
            <ProfileManager />
            <PreFlightChecklist />
          </div>
        )}

        {/* 2. Center Stage (Slides & Tools) */}
        <div className="flex flex-1 flex-col overflow-y-auto relative custom-scrollbar bg-slate-900">
          <div className="mx-auto w-full max-w-6xl flex-1 px-8 py-8 flex flex-col gap-8 transition-all">
            {/* Presentation Viewport */}
            <div className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl group">
              <div className="relative aspect-[16/9] w-full bg-black">
                <div className="absolute inset-0">
                  <SlideRenderer slide={slide} isActive onNavigate={goTo} />
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <SlideControls
                  currentSlide={currentSlide}
                  totalSlides={totalSlides}
                  onPrev={goPrev}
                  onNext={goNext}
                  onGoTo={goTo}
                  className="mx-auto max-w-2xl px-4"
                />
              </div>
            </div>

            {/* Active Slide Notes Editor */}
            <div className="shrink-0 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">Live Demo Notes</h3>
                <p className="text-xs text-slate-500 ml-1 mt-0.5">Edit context for this slide on the fly.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                <SlideNotesEditor
                  key={slide.id}
                  content={`<p>${slide.notes || 'No notes currently written for this feature...'}</p>`}
                  onChange={(val) => {
                    // Local editor state persists
                  }}
                />
              </div>
            </div>

            {/* Embed Collector Below Slide */}
            <div className="shrink-0 pb-12">
              <EmbedCollector initialEntries={initialEmbeds} />
            </div>
          </div>
        </div>

        {/* 3. Right Sidebar (AI Copilot Sliders/Tools) */}
        {showRightSidebar && (
          <div className="flex w-[380px] shrink-0 flex-col border-l border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 z-10 transition-all">
            <div className="h-full w-full">
              <DemoCopilot currentSlideData={slide} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
