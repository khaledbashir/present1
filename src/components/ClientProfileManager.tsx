'use client';

import { useState } from 'react';
import { generateClientProfile, ClientProfileData } from '@/app/actions/clientProfile';
import { useSyncState } from '@/hooks/useSyncState';

export default function ClientProfileManager() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useSyncState<ClientProfileData | null>('present_client_profile', null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError('');
        try {
            const data = await generateClientProfile(query);
            setProfile(data);
        } catch (err: any) {
            setError(err.message || 'Failed to generate profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setProfile(null);
        setQuery('');
    };

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-black/5">
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Client Personalization</h2>
                <p className="text-sm text-slate-500">Inject client context into the clean Share View.</p>
            </div>

            {!profile ? (
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Acme Corp or acme.com..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !query.trim()}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Generating Context...
                            </>
                        ) : (
                            'Generate Client Context'
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div className="flex items-center gap-4 max-w-[70%]">
                        {profile.logoUrl ? (
                            <img src={profile.logoUrl} alt="Logo" className="h-12 w-12 rounded-xl bg-white object-contain shadow-sm p-1 border border-slate-200" />
                        ) : (
                            <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase">
                                {profile.name.substring(0, 2)}
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-slate-900">{profile.name} <span className="text-xs font-normal text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full ml-2">Active</span></h3>
                            <p className="text-xs text-slate-500 truncate" title={profile.description}>{profile.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
