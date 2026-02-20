import { Slide } from '@/types/slides';

interface Props {
    slides: Slide[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

export default function FeaturePlaylist({ slides, currentIndex, onSelect }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <div className="mb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Meeting Agenda</h3>
                <p className="text-xs text-slate-500 mt-1">Live Demo Features</p>
            </div>

            <div className="flex flex-col gap-2">
                {slides.map((slide, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <button
                            key={slide.id}
                            onClick={() => onSelect(index)}
                            className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${isActive
                                    ? 'bg-indigo-600 shadow-md ring-1 ring-indigo-500'
                                    : 'bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                    {slide.title}
                                </p>
                                <p className={`truncate text-xs ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    {slide.type === 'iframe' ? 'Live Canvas' : 'Context Slide'}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
