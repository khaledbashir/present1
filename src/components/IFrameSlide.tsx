'use client';

import { IFrameSlide as IFrameSlideType } from '@/types/slides';

interface Props {
  slide: IFrameSlideType;
  isActive: boolean;
}

export default function IFrameSlide({ slide, isActive }: Props) {
  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden">
      {isActive ? (
        <iframe
          src={slide.url}
          className="absolute inset-0 w-full h-full border-0"
          title={slide.title}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900 bg-opacity-80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium tracking-wide">Loading Live Canvas...</span>
          </div>
        </div>
      )}
    </div>
  );
}
