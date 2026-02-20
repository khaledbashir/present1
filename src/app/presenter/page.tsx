'use client';

import { useState, useCallback, useEffect } from 'react';
import { DeckConfig, Slide } from '@/types/slides';
import SlideRenderer from '@/components/SlideRenderer';
import DemoCopilot from '@/components/DemoCopilot';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSyncSlide } from '@/hooks/useSyncSlide';
import ancDemoData from '@/data/anc-demo.json';

export default function PresenterView() {
  const deck = ancDemoData as unknown as DeckConfig;
  const [currentSlide, setCurrentSlide] = useSyncSlide(0);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
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

  useKeyboardNav({ onNext: goNext, onPrev: goPrev });

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const slide = deck.slides[currentSlide];
  const nextSlide = deck.slides[currentSlide + 1];

  return (
    <div className="h-screen w-screen bg-zinc-950 flex overflow-hidden">
      {/* 1. Left Sidebar: Preview Canvas */}
      <div className="flex-1 flex flex-col border-r border-zinc-800">
        <div className="flex-1 p-4">
          <div className="h-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <SlideRenderer slide={slide} isActive={true} />
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm font-mono">{formatTime(elapsed)}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 text-sm">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={goNext}
              disabled={currentSlide === totalSlides - 1}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 2. Middle Sidebar: Notes and Navigation */}
      <div className="w-80 shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Current Feature</h2>
          <p className="text-zinc-200 font-medium mt-1">{slide.title}</p>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Playbook Notes</h3>
          <p className="text-zinc-400 text-sm whitespace-pre-wrap">
            {slide.notes || 'No notes for this slide.'}
          </p>
        </div>

        {nextSlide && (
          <div className="p-4 border-t border-zinc-800 shrink-0">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Next Up</h3>
            <p className="text-zinc-300 text-sm">{nextSlide.title}</p>
            {nextSlide.notes && (
              <p className="text-zinc-600 text-xs mt-1 line-clamp-2">{nextSlide.notes}</p>
            )}
          </div>
        )}

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Feature List</h3>
          <div className="space-y-1 max-h-40 overflow-auto custom-scrollbar">
            {deck.slides.map((s: Slide, i: number) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${i === currentSlide
                  ? 'bg-indigo-600/20 text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Right Sidebar: Demo Copilot */}
      <div className="w-[380px] shrink-0 bg-white h-full flex flex-col shadow-xl">
        <DemoCopilot currentSlideData={slide} />
      </div>
    </div>
  );
}
