import { TitleCardSlide } from '@/types/slides';

interface Props {
    slide: TitleCardSlide;
}

export default function TitleCardSlideComponent({ slide }: Props) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-12 text-center text-white relative overflow-hidden">
            {/* Abstract background blobs for aesthetics */}
            <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[50%] rounded-full bg-cyan-600/20 blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent pb-2">
                    {slide.title}
                </h1>

                {slide.subtitle && (
                    <p className="text-xl sm:text-2xl font-medium text-slate-300 mt-4 max-w-2xl px-4 leading-relaxed tracking-wide">
                        {slide.subtitle}
                    </p>
                )}

                <div className="mt-16 h-1 w-24 rounded-full bg-indigo-500/50" />

                <p className="mt-16 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Forge Engine Presentation
                </p>
            </div>
        </div>
    );
}
