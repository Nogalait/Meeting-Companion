import React, { useState } from 'react';
import { Meeting } from '../types';
import { Timer } from './Timer';
import { AgendaEditor } from './AgendaEditor';
import { ActionTracker } from './ActionTracker';
import { ResourcesLibrary } from './ResourcesLibrary';
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
      <header className="flex-none px-4 sm:px-8 py-6 border-b border-zinc-100 flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={meeting.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Meeting Title..."
            className="w-full text-2xl sm:text-3xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 tracking-tight bg-transparent"
          />
          <div className="flex items-center gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-500 font-mono">
            <span className="truncate">ID: {meeting.id}</span>
          </div>
        </div>
        <div className="sm:pl-6 flex-none w-full sm:w-auto flex justify-start sm:justify-end">
          <Timer initialSeconds={meeting.timerDuration} />
        </div>
      </header>

      {/* Workspace Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div id="meeting-workspace-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-32">
          <AgendaEditor 
            value={meeting.agenda} 
            onChange={(val) => onUpdate({ agenda: val })} 
          />
          <ResourcesLibrary markdown={meeting.agenda} />
          <ActionTracker 
            actions={meeting.actions}
            onChange={(actions) => onUpdate({ actions })}
          />
        </div>
      </div>

      {/* Footer Utility Bar */}
      <footer className="flex-none bg-white border-t border-zinc-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="text-xs text-zinc-400 w-full sm:w-auto text-center sm:text-left">
          Auto-saved. Local only.
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <button 
            onClick={handleCopy}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button 
            onClick={handlePdfExport}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          
          <button 
            onClick={handleMarkdownExport}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto mt-2 sm:mt-0"
          >
            <FileCode2 className="w-4 h-4" />
            GenAI Markdown
          </button>
        </div>
      </footer>
    </div>
  );
}
