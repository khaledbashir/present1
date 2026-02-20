'use client';

import { useChat } from 'ai/react';
import { Slide } from '@/types/slides';
import { useState, useRef, useEffect } from 'react';

export default function DemoCopilot({ currentSlideData }: { currentSlideData?: Slide }) {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: { slideContext: currentSlideData }
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-full w-full flex-col bg-slate-50/50">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="flex bg-indigo-100 text-indigo-600 p-2 rounded-lg shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M22 12A10 10 0 1 1 12 2v10z" /><path d="m14.5 9.5 5-5" /></svg>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">AI Demo Copilot</h3>
                        <p className="text-xs font-medium text-slate-500 truncate">Listening to slide context</p>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-center space-y-4">
                        <div className="rounded-full bg-slate-200/50 p-5 ring-4 ring-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 2v2" /><path d="M12 22v-2" /><path d="m17 20.66-1-1.73" /><path d="M11 5.07 10 3.34" /><path d="m20.66 17-1.73-1" /><path d="m3.34 10 1.731 1" /><path d="M14 12h8" /><path d="M2 12h2" /><path d="m20.66 7-1.73 1" /><path d="m3.34 14 1.73-1" /><path d="m17 3.34-1 1.73" /><path d="m11 18.93-1 1.73" /></svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-1">Your Slide Wingman</h4>
                            <p className="text-xs text-slate-500 px-6 leading-relaxed">Ask me to clarify metrics, suggest positioning, or handle objections based on your notes.</p>
                        </div>
                    </div>
                )}
                {messages.map((m: any) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl px-4 py-2.5 max-w-[90%] text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                            <div className="prose prose-sm prose-slate break-words" dangerouslySetInnerHTML={{ __html: m.role !== 'user' ? m.content.replace(/\n([^<])/g, '<br/>$1') : m.content }} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-tl-sm shadow-sm text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200 bg-white p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all min-w-0"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask the copilot..."
                    />
                    <button type="submit" disabled={!input || isLoading} className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:bg-slate-400 disabled:shadow-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
