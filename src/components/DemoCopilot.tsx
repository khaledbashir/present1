'use client';

import { useChat } from 'ai/react';
import { Slide } from '@/types/slides';
import { useState, useRef, useEffect } from 'react';

export default function DemoCopilot({ currentSlideData }: { currentSlideData?: Slide }) {
    const [isOpen, setIsOpen] = useState(false);

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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 p-4 text-white shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M22 12A10 10 0 1 1 12 2v10z" /><path d="m14.5 9.5 5-5" /></svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M22 12A10 10 0 1 1 12 2v10z" /><path d="m14.5 9.5 5-5" /></svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">AI Demo Copilot</h3>
                        <p className="text-xs text-slate-500 truncate w-[200px]">Listening to: {currentSlideData?.title || 'None'}</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center py-8 text-center space-y-3">
                        <div className="rounded-full bg-slate-100 p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 2v2" /><path d="M12 22v-2" /><path d="m17 20.66-1-1.73" /><path d="M11 5.07 10 3.34" /><path d="m20.66 17-1.73-1" /><path d="m3.34 10 1.731 1" /><path d="M14 12h8" /><path d="M2 12h2" /><path d="m20.66 7-1.73 1" /><path d="m3.34 14 1.73-1" /><path d="m17 3.34-1 1.73" /><path d="m11 18.93-1 1.73" /></svg>
                        </div>
                        <p className="text-sm text-slate-500">I'm your invisible assistant.<br />Ask me anything about the slide or the client during your demo.</p>
                    </div>
                )}
                {messages.map((m: any) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
                            <div className="prose prose-sm prose-slate" dangerouslySetInnerHTML={{ __html: m.role !== 'user' ? m.content.replace(/\n([^<])/g, '<br/>$1') : m.content }} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-bl-sm shadow-sm text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 bg-white p-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask your copilot..."
                    />
                    <button type="submit" disabled={!input || isLoading} className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
