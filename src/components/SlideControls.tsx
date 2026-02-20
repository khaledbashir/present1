'use client';

interface Props {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  className?: string;
}

export default function SlideControls({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
  className,
}: Props) {
  return (
    <div
      className={`rounded-3xl border border-zinc-800 bg-zinc-900/70 px-6 py-3 backdrop-blur ${
        className ?? ''
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          className="px-4 py-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm">
            {currentSlide + 1} / {totalSlides}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => onGoTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'bg-emerald-500 w-6' : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="px-4 py-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
