'use client';

import { useState } from 'react';
import { useSyncState } from '@/hooks/useSyncState';
import { EmbedEntry } from '@/components/EmbedCollector';
import { ClientProfileData } from '@/app/actions/clientProfile';
import { ChecklistItem } from '@/components/PreFlightChecklist';

export interface SavedProfile {
    id: string;
    name: string;
    embeds: EmbedEntry[];
    clientData: ClientProfileData | null;
    checklist: ChecklistItem[];
    lastModified: number;
}

export default function ProfileManager() {
    const [profiles, setProfiles] = useSyncState<SavedProfile[]>('present_saved_profiles', []);

    // Current state access
    const [currentEmbeds, setCurrentEmbeds] = useSyncState<EmbedEntry[]>('present_embeds', []);
    const [currentClient] = useSyncState<ClientProfileData | null>('present_client_profile', null);
    const [currentChecklist] = useSyncState<ChecklistItem[]>('present_checklist', []);

    const [newProfileName, setNewProfileName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const saveCurrentState = () => {
        if (!newProfileName.trim()) return;

        const newProfile: SavedProfile = {
            id: Date.now().toString(),
            name: newProfileName.trim(),
            embeds: currentEmbeds,
            clientData: currentClient,
            checklist: currentChecklist,
            lastModified: Date.now(),
        };

        setProfiles((prev) => [...prev, newProfile]);
        setNewProfileName('');
        setIsSaving(false);
    };

    const loadProfile = (profile: SavedProfile) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('present_embeds', JSON.stringify(profile.embeds));
            localStorage.setItem('present_client_profile', JSON.stringify(profile.clientData));
            localStorage.setItem('present_checklist', JSON.stringify(profile.checklist));
            // Force a storage event to sync other components
            window.dispatchEvent(new Event('storage'));

            // Reload page to ensure all components pick up fresh state properly if needed, although useSyncState should handle it.
            // We will rely on useSyncState for smooth UX without reload.
        }
    };

    const deleteProfile = (id: string) => {
        setProfiles((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-black/5">
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Saved Profiles</h2>
                <p className="text-sm text-slate-500">Save and load your workspace layout for specific clients.</p>
            </div>

            {profiles.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 leading-none mb-1">{profile.name}</h3>
                                <p className="text-xs text-slate-500">
                                    {profile.embeds.length} Links • {profile.clientData ? 'Context set' : 'No context'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => loadProfile(profile)}
                                    className="rounded-lg bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-200 transition-colors"
                                >
                                    Load
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteProfile(profile.id);
                                    }}
                                    className="rounded-lg text-slate-400 p-1.5 hover:text-red-500 hover:bg-red-50 transition-colors pointer-events-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isSaving ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveCurrentState()}
                        autoFocus
                        className="flex-1 rounded-lg border border-indigo-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="Profile name (e.g. Acme Corp)"
                    />
                    <button
                        onClick={saveCurrentState}
                        disabled={!newProfileName.trim()}
                        className="flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsSaving(false)}
                        className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsSaving(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 transition-all w-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    Save Current Workspace State
                </button>
            )}
        </div>
    );
}
