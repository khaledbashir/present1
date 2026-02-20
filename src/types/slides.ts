export type SlideType = 'iframe' | 'content' | 'split' | 'dashboard' | 'title-card';

export interface BaseSlide {
  id: string;
  type: SlideType;
  title: string;
  notes?: string;
}

export interface TitleCardSlide extends BaseSlide {
  type: 'title-card';
  subtitle?: string;
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
  targetSlideIndex: number;
  isMain?: boolean;
}

export interface DashboardSlide extends BaseSlide {
  type: 'dashboard';
  cards: DashboardCard[];
}

export type Slide = TitleCardSlide | IFrameSlide | ContentSlide | SplitSlide | DashboardSlide;

export interface DeckConfig {
  name: string;
  author?: string;
  created?: string;
  slides: Slide[];
}
