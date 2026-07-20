import React, { useEffect, useRef, useState } from 'react';
import { Type, Heading1, Heading2, Heading3, AArrowUp, AArrowDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface AgendaEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function AgendaEditor({ value, onChange }: AgendaEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState(16); // default 16px

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, fontSize]);

  const insertText = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Check if we are at the start of a line
    const beforeCursor = text.substring(0, start);
    const isLineStart = beforeCursor.length === 0 || beforeCursor.endsWith('\n');
    
    const insertion = isLineStart ? prefix : `\n${prefix}`;
    const newValue = text.substring(0, start) + insertion + text.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the inserted prefix
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Agenda & Notes
        </h2>
        
        <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-md border border-zinc-200">
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Decrease Font Size">
            <AArrowDown className="w-4 h-4" />
          </button>
          <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Increase Font Size">
            <AArrowUp className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-300 mx-1"></div>
          <button onClick={() => insertText('# ')} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </button>
          <button onClick={() => insertText('## ')} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </button>
          <button onClick={() => insertText('### ')} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type to add notes... (Auto-saves continuously)"
        className="w-full min-h-[200px] resize-none outline-none text-zinc-800 leading-relaxed bg-transparent placeholder:text-zinc-300 transition-all font-sans"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
}
