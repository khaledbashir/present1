'use client';

import { SplitSlide as SplitSlideType } from '@/types/slides';

interface Props {
  slide: SplitSlideType;
  isActive: boolean;
}

function parseMarkdown(content: string) {
  const lines = content.split('\n');
  
  return lines.map((line, i) => {
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-3xl font-bold text-zinc-100 mb-4">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-xl font-semibold text-zinc-200 mb-3">{line.slice(3)}</h2>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="text-lg text-zinc-300 mb-2 ml-4">{line.slice(2)}</li>;
    }
    if (line.trim() === '') {
      return <div key={i} className="h-2" />;
    }
    return <p key={i} className="text-lg text-zinc-300 mb-2">{line}</p>;
  });
}

export default function SplitSlide({ slide, isActive }: Props) {
  return (
    <div className="w-full h-full flex">
      <div className="w-1/2 p-8 flex flex-col justify-center border-r border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{slide.title}</h2>
        <div>{parseMarkdown(slide.content)}</div>
      </div>
      <div className="w-1/2 p-4">
        <div className="w-full h-full rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
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
    </div>
  );
}
