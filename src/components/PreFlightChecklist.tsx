'use client';

import { useState } from 'react';
import { useSyncState } from '@/hooks/useSyncState';

export interface ChecklistItem {
    id: string;
    label: string;
    checked: boolean;
}

const defaultItems: ChecklistItem[] = [
    { id: '1', label: 'Clear browser history & bookmarks bar', checked: false },
    { id: '2', label: 'Turn on Do Not Disturb (Mac/Windows)', checked: false },
    { id: '3', label: 'Start local server (if needed)', checked: false },
    { id: '4', label: 'Generate Client Context profile', checked: false },
    { id: '5', label: 'Open Share View in separate window', checked: false },
];

export default function PreFlightChecklist() {
    const [items, setItems] = useSyncState<ChecklistItem[]>('present_checklist', defaultItems);
    const [newItemLabel, setNewItemLabel] = useState('');

    const toggleItem = (id: string) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    const addItem = () => {
        if (!newItemLabel.trim()) return;
        setItems((prev) => [...prev, { id: Date.now().toString(), label: newItemLabel.trim(), checked: false }]);
        setNewItemLabel('');
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const resetChecked = () => {
        setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
    };

    const allDone = items.length > 0 && items.every((i) => i.checked);

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Pre-Flight Checklist</h2>
                    <p className="text-sm text-slate-500">Ensure everything is ready before screen sharing.</p>
                </div>
                {allDone && (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Ready for takeoff
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between gap-3 rounded-xl hover:bg-slate-50 px-2 py-1.5 -mx-2 transition-colors">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItem(item.id)}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors cursor-pointer"
                            />
                            <span className={`text-sm select-none transition-all ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {item.label}
                            </span>
                        </label>
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-100">
                <input
                    type="text"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 transition-all"
                    placeholder="Add custom check..."
                />
                <button
                    onClick={addItem}
                    disabled={!newItemLabel.trim()}
                    className="flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                    Add
                </button>
                <button
                    onClick={resetChecked}
                    className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Reset all checks"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
