'use client';

import { ContentSlide as ContentSlideType } from '@/types/slides';

interface Props {
  slide: ContentSlideType;
}

function parseMarkdown(content: string) {
  const lines = content.split('\n');
  
  return lines.map((line, i) => {
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-5xl font-bold text-zinc-100 mb-6">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-3xl font-semibold text-zinc-200 mb-4">{line.slice(3)}</h2>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="text-xl font-bold text-emerald-400 mb-2">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('- ')) {
      const text = line.slice(2);
      const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>');
      return (
        <li key={i} className="text-xl text-zinc-300 mb-2 ml-6" dangerouslySetInnerHTML={{ __html: boldText }} />
      );
    }
    if (line === '---') {
      return <hr key={i} className="border-zinc-700 my-6 w-1/2 mx-auto" />;
    }
    if (line.trim() === '') {
      return <div key={i} className="h-4" />;
    }
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>');
    return <p key={i} className="text-xl text-zinc-300 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
}

export default function ContentSlide({ slide }: Props) {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-12"
      style={{ backgroundColor: slide.bgColor || 'transparent' }}
    >
      <div className="max-w-4xl w-full">
        {parseMarkdown(slide.content)}
      </div>
    </div>
  );
}
