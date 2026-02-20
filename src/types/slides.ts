export type SlideType = 'iframe' | 'content' | 'split' | 'dashboard';

export interface BaseSlide {
  id: string;
  type: SlideType;
  title: string;
  notes?: string;
}

export interface IFrameSlide extends BaseSlide {
  type: 'iframe';
  url: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'full';
}

export interface ContentSlide extends BaseSlide {
  type: 'content';
  content: string;
  bgColor?: string;
}

export interface SplitSlide extends BaseSlide {
  type: 'split';
  url: string;
  content: string;
}

export interface DashboardCard {
  title: string;
  description?: string;
  icon?: string;
  targetSlideIndex: number; // The index of the slide this card links to
  isMain?: boolean; // If true, this card is rendered larger
}

export interface DashboardSlide extends BaseSlide {
  type: 'dashboard';
  cards: DashboardCard[];
}

export type Slide = IFrameSlide | ContentSlide | SplitSlide | DashboardSlide;

export interface DeckConfig {
  name: string;
  author?: string;
  created?: string;
  slides: Slide[];
}
