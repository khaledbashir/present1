'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface Props {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 text-slate-600 shrink-0">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`rounded p-1.5 text-sm hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-slate-200 font-bold' : ''}`}
                title="Bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8" /><path d="M15 20a4 4 0 0 0 0-8H6v8Z" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`rounded p-1.5 text-sm hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-slate-200 italic' : ''}`}
                title="Italic"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`rounded p-1.5 text-sm hover:bg-slate-200 ${editor.isActive('strike') ? 'bg-slate-200 line-through' : ''}`}
                title="Strikethrough"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12V2" /><path d="M10 20v-8" /><path d="M5 12h14" /></svg>
            </button>

            <div className="mx-1 h-4 w-[1px] bg-slate-300"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`rounded p-1.5 text-sm hover:bg-slate-200 ${editor.isActive('bulletList') ? 'bg-slate-200' : ''}`}
                title="Bullet List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`rounded p-1.5 text-sm hover:bg-slate-200 ${editor.isActive('orderedList') ? 'bg-slate-200' : ''}`}
                title="Numbered List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h11" /><path d="M10 12h11" /><path d="M10 18h11" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
            </button>

            <div className="mx-1 h-4 w-[1px] bg-slate-300"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="rounded p-1.5 text-sm hover:bg-slate-200 disabled:opacity-30"
                title="Undo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="rounded p-1.5 text-sm hover:bg-slate-200 disabled:opacity-30"
                title="Redo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg>
            </button>
        </div>
    );
};

export default function SlideNotesEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-slate focus:outline-none min-h-[150px] p-4 max-w-none',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto w-full bg-white">
                <EditorContent editor={editor} className="w-full h-full" />
            </div>
        </div>
    );
}
