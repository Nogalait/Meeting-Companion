import React, { useState } from 'react';
import { Meeting } from '../types';
import { Timer } from './Timer';
import { AgendaEditor } from './AgendaEditor';
import { ActionTracker } from './ActionTracker';
import { generateMarkdown, copyToClipboard, exportToPDF } from '../utils/exportUtils';
import { Copy, FileDown, FileCode2, CheckCircle2, Database, Menu } from 'lucide-react';

interface MeetingWorkspaceProps {
  meeting: Meeting;
  onUpdate: (updates: Partial<Meeting>) => void;
  addLog?: (action: string, details?: string) => void;
  onToggleSidebar?: () => void;
}

export function MeetingWorkspace({ meeting, onUpdate, addLog, onToggleSidebar }: MeetingWorkspaceProps) {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleCopy = async () => {
    const md = generateMarkdown(meeting);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      addLog?.('Copied to Clipboard', `Meeting: ${meeting.title || 'Untitled'}`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePdfExport = () => {
    exportToPDF('meeting-workspace-content', meeting.title);
    addLog?.('Exported to PDF', `Meeting: ${meeting.title || 'Untitled'}`);
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
    addLog?.('Exported Markdown', `Meeting: ${meeting.title || 'Untitled'}`);
  };

  const handleSyncToSheet = async () => {
    const webhookUrl = localStorage.getItem('companion_webhook_url');
    if (!webhookUrl) {
      alert('Please configure your Google Sheets Webhook URL in Settings first.');
      return;
    }
    
    setIsSyncing(true);
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Prevents CORS issues on simple sheet scripts
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(meeting)
      });
      
      setSyncSuccess(true);
      addLog?.('Synced to Google Sheets', `Meeting: ${meeting.title || 'Untitled'}`);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to sync to Sheet', err);
      addLog?.('Sync Failed', `Meeting: ${meeting.title || 'Untitled'}`);
      alert('Failed to sync to Google Sheets. Check console for details.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[100dvh] bg-white relative w-full overflow-hidden">
      {/* Header */}
      <header className="flex-none p-4 md:px-8 md:py-6 border-b border-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full flex items-start gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={meeting.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Meeting Title..."
              className="w-full text-2xl md:text-3xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 tracking-tight bg-transparent"
            />
            <div className="flex items-center gap-4 mt-2 text-xs md:text-sm text-zinc-500 font-mono">
              <span className="truncate">ID: {meeting.id}</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto flex justify-start md:justify-end md:pl-6">
          <Timer initialSeconds={meeting.timerDuration} />
        </div>
      </header>

      {/* Workspace Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div id="meeting-workspace-content" className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-32">
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
      <footer className="flex-none bg-white border-t border-zinc-200 p-4 md:px-6 md:py-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-10">
        <div className="text-xs text-zinc-400 w-full sm:w-auto text-center sm:text-left">
          Auto-saved. Local only.
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
          <button 
            onClick={handleSyncToSheet}
            disabled={isSyncing}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex-1 sm:flex-none justify-center"
          >
            {syncSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Database className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : syncSuccess ? 'Saved to Sheet' : 'Save to Sheet'}</span>
            <span className="sm:hidden">{isSyncing ? 'Syncing...' : syncSuccess ? 'Saved' : 'Sheet'}</span>
          </button>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm flex-1 sm:flex-none justify-center"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            <span className="sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button 
            onClick={handlePdfExport}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm flex-1 sm:flex-none justify-center"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          
          <button 
            onClick={handleMarkdownExport}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-sm flex-1 sm:flex-none justify-center"
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">GenAI Markdown</span>
            <span className="sm:hidden">Markdown</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
