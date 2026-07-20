import React, { useState } from 'react';
import { Meeting } from '../types';
import { Timer } from './Timer';
import { AgendaEditor } from './AgendaEditor';
import { ActionTracker } from './ActionTracker';
import { generateMarkdown, copyToClipboard, exportToPDF } from '../utils/exportUtils';
import { Copy, FileDown, FileCode2, CheckCircle2 } from 'lucide-react';

interface MeetingWorkspaceProps {
  meeting: Meeting;
  onUpdate: (updates: Partial<Meeting>) => void;
}

export function MeetingWorkspace({ meeting, onUpdate }: MeetingWorkspaceProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const md = generateMarkdown(meeting);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePdfExport = () => {
    exportToPDF('meeting-workspace-content', meeting.title);
  };

  const handleMarkdownExport = () => {
    const md = generateMarkdown(meeting);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title || 'Meeting'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex-none px-8 py-6 border-b border-zinc-100 flex items-start justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={meeting.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Meeting Title..."
            className="w-full text-3xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 tracking-tight"
          />
          <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500 font-mono">
            <span>ID: {meeting.id}</span>
          </div>
        </div>
        <div className="pl-6 flex-none">
          <Timer initialSeconds={meeting.timerDuration} />
        </div>
      </header>

      {/* Workspace Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div id="meeting-workspace-content" className="max-w-4xl mx-auto px-8 py-10 pb-32">
          <AgendaEditor 
            value={meeting.agenda} 
            onChange={(val) => onUpdate({ agenda: val })} 
          />
          <ActionTracker 
            actions={meeting.actions}
            onChange={(actions) => onUpdate({ actions })}
          />
        </div>
      </div>

      {/* Footer Utility Bar */}
      <footer className="flex-none bg-white border-t border-zinc-200 px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="text-xs text-zinc-400">
          Auto-saved. Local only.
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button 
            onClick={handlePdfExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
          
          <button 
            onClick={handleMarkdownExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <FileCode2 className="w-4 h-4" />
            GenAI Markdown
          </button>
        </div>
      </footer>
    </div>
  );
}
