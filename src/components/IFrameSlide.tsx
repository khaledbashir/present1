'use client';

import { IFrameSlide as IFrameSlideType } from '@/types/slides';

interface Props {
  slide: IFrameSlideType;
  isActive: boolean;
}

export default function IFrameSlide({ slide, isActive }: Props) {
  const aspectClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'full': 'h-full',
  }[slide.aspectRatio || '16/9'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-zinc-200 mb-4">{slide.title}</h2>
      <div className={`w-full max-w-6xl ${aspectClass} rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900`}>
        {isActive ? (
          <iframe
            src={slide.url}
            className="w-full h-full"
            title={slide.title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
