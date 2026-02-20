import { useState } from 'react';
import { DashboardSlide } from '@/types/slides';

interface Props {
    slide: DashboardSlide;
    onNavigate?: (index: number) => void;
}

export default function DashboardView({ slide, onNavigate }: Props) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const mainCard = slide.cards.find((c) => c.isMain);
    const secondaryCards = slide.cards.filter((c) => !c.isMain);

    return (
        <div className="flex h-full w-full flex-col bg-slate-900 p-8 text-slate-100">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{slide.title}</h1>
                {slide.notes && <p className="text-lg text-slate-400 max-w-2xl">{slide.notes}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Main Card (Takes up 2/3 width on standard display, or full height in a bento layout) */}
                {mainCard && (
                    <div
                        className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 p-8 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/30 cursor-pointer flex flex-col justify-end"
                        onMouseEnter={() => setHoveredIndex(-1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onNavigate && onNavigate(mainCard.targetSlideIndex)}
                    >
                        <div className="absolute top-8 right-8 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        {mainCard.icon && (
                            <div className="mb-6 h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                                {mainCard.icon}
                            </div>
                        )}
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{mainCard.title}</h2>
                        {mainCard.description && (
                            <p className="text-slate-300 text-lg max-w-md">{mainCard.description}</p>
                        )}
                    </div>
                )}

                {/* Secondary Cards Column */}
                <div className="flex flex-col gap-6 md:col-span-1">
                    {secondaryCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="group relative flex-1 overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 transition-all hover:border-purple-500/50 hover:bg-white/10 cursor-pointer flex flex-col justify-center"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onNavigate && onNavigate(card.targetSlideIndex)}
                        >
                            <div className="absolute top-6 right-6 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                                {card.icon && (
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                                        {card.icon}
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                            </div>
                            {card.description && (
                                <p className="text-slate-400 text-sm">{card.description}</p>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
