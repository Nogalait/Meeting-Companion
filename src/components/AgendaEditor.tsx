import React, { useEffect, useRef, useState } from 'react';
import { Type, Heading1, Heading2, Heading3, AArrowUp, AArrowDown, Link2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { resizeImageFile } from '../utils/imageUtils';

interface AgendaEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function AgendaEditor({ value, onChange }: AgendaEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState(16); // default 16px
  const [isUploading, setIsUploading] = useState(false);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, fontSize]);

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newValue = text.substring(0, start) + textToInsert + text.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const insertText = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const beforeCursor = text.substring(0, start);
    const isLineStart = beforeCursor.length === 0 || beforeCursor.endsWith('\n');
    
    const insertion = isLineStart ? prefix : `\n${prefix}`;
    insertAtCursor(insertion);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    let imageFile: File | null = null;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        imageFile = items[i].getAsFile();
        break;
      }
    }
    
    if (imageFile) {
      e.preventDefault();
      setIsUploading(true);
      try {
        const dataUrl = await resizeImageFile(imageFile, 800);
        insertAtCursor(`\n![Pasted Image](${dataUrl})\n`);
      } catch (err) {
        console.error("Failed to process image", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL:");
    if (!url) return;
    const title = prompt("Enter the link title (optional):") || "Link";
    insertAtCursor(`[${title}](${url})`);
  };

  const handleInsertImage = () => {
    const url = prompt("Enter the Image URL:");
    if (!url) return;
    const alt = prompt("Enter the image description (optional):") || "Image";
    insertAtCursor(`![${alt}](${url})`);
  };

  return (
    <div className="w-full relative">
      {isUploading && (
        <div className="absolute top-0 right-0 m-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded animate-pulse">
          Processing image...
        </div>
      )}
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
          <div className="w-px h-4 bg-zinc-300 mx-1"></div>
          <button onClick={handleInsertLink} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Insert Link">
            <Link2 className="w-4 h-4" />
          </button>
          <button onClick={handleInsertImage} className="p-1 hover:bg-zinc-200 rounded text-zinc-600" title="Insert Image URL">
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder="Type to add notes... (Auto-saves continuously. Paste images directly here.)"
        className="w-full min-h-[200px] resize-none outline-none text-zinc-800 leading-relaxed bg-transparent placeholder:text-zinc-300 transition-all font-sans"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
}
