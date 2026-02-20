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

    const btnClass = "rounded p-1.5 text-sm transition-colors";
    const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-slate-200";
    const activeClass = "bg-indigo-500/20 text-indigo-400 font-medium";

    const getBtnStyle = (isActive: boolean) => `${btnClass} ${isActive ? activeClass : inactiveClass}`;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 bg-slate-900/50 p-2 shrink-0">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={getBtnStyle(editor.isActive('bold'))}
                title="Bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8" /><path d="M15 20a4 4 0 0 0 0-8H6v8Z" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`${getBtnStyle(editor.isActive('italic'))} italic`}
                title="Italic"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`${getBtnStyle(editor.isActive('strike'))} line-through`}
                title="Strikethrough"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12V2" /><path d="M10 20v-8" /><path d="M5 12h14" /></svg>
            </button>

            <div className="mx-1 h-4 w-[1px] bg-slate-700"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={getBtnStyle(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={getBtnStyle(editor.isActive('orderedList'))}
                title="Numbered List"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h11" /><path d="M10 12h11" /><path d="M10 18h11" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
            </button>

            <div className="mx-1 h-4 w-[1px] bg-slate-700"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className={`${btnClass} ${inactiveClass} disabled:opacity-30 disabled:cursor-not-allowed`}
                title="Undo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className={`${btnClass} ${inactiveClass} disabled:opacity-30 disabled:cursor-not-allowed`}
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
                class: 'prose prose-sm prose-invert focus:outline-none min-h-[150px] p-5 max-w-none text-slate-300',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="flex flex-col h-full w-full bg-slate-950">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                <EditorContent editor={editor} className="w-full h-full" />
            </div>
        </div>
    );
}
