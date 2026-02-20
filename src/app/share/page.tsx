'use client';

import { useCallback } from 'react';
import { DeckConfig } from '@/types/slides';
import SlideRenderer from '@/components/SlideRenderer';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSyncState } from '@/hooks/useSyncState';
import { ClientProfileData } from '@/app/actions/clientProfile';
import slidesData from '@/data/slides.json';

export default function ShareView() {
    const deck = slidesData as DeckConfig;
    const [currentSlide, setCurrentSlide] = useSyncState<number>('present_current_slide', 0);
    const [clientProfile] = useSyncState<ClientProfileData | null>('present_client_profile', null);

    const totalSlides = deck.slides.length;

    const goNext = useCallback(() => {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    }, [totalSlides, setCurrentSlide]);

    const goPrev = useCallback(() => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, [setCurrentSlide]);

    const goTo = useCallback((index: number) => {
        setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    }, [totalSlides, setCurrentSlide]);

    useKeyboardNav({ onNext: goNext, onPrev: goPrev });

    const slide = deck.slides[currentSlide];

    return (
        <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
            {clientProfile && (
                <div className="absolute top-8 right-8 z-50 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-2xl transition-all duration-1000 ease-in-out opacity-100 translate-y-0">
                    <div className="text-right flex flex-col justify-center">
                        <span className="text-white font-semibold flex items-center justify-end gap-2 text-lg">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {clientProfile.name}
                        </span>
                        <span className="text-white/60 text-xs max-w-[200px] truncate">{clientProfile.description}</span>
                    </div>
                    {clientProfile.logoUrl && (
                        <img src={clientProfile.logoUrl} alt={clientProfile.name} className="h-12 w-12 object-contain bg-white rounded-lg p-1.5 shadow-lg" />
                    )}
                </div>
            )}
            <div className="w-full max-w-7xl aspect-[16/9] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                {slide ? (
                    <SlideRenderer slide={slide} isActive={true} onNavigate={goTo} />
                ) : null}
            </div>
        </div>
    );
}
