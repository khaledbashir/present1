'use client';

import { Slide } from '@/types/slides';
import IFrameSlide from './IFrameSlide';
import ContentSlide from './ContentSlide';
import SplitSlide from './SplitSlide';
import DashboardSlideComponent from './DashboardSlide';
import TitleCardSlideComponent from './TitleCardSlide';

interface Props {
  slide: Slide;
  isActive: boolean;
  onNavigate?: (index: number) => void;
}

export default function SlideRenderer({ slide, isActive, onNavigate }: Props) {
  switch (slide.type) {
    case 'title-card':
      return <TitleCardSlideComponent slide={slide} />;
    case 'dashboard':
      return <DashboardSlideComponent slide={slide} onNavigate={onNavigate} />;
    case 'iframe':
      return <IFrameSlide slide={slide} isActive={isActive} />;
    case 'content':
      return <ContentSlide slide={slide} />;
    case 'split':
      return <SplitSlide slide={slide} isActive={isActive} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-slate-900">
          Unknown slide type: {(slide as any).type}
        </div>
      );
  }
}
