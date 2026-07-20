import React, { useState } from 'react';
import { Meeting } from '../types';
import { format } from 'date-fns';
import { Plus, Settings, FileText, EyeOff, Eye, Palette } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  meetings: Meeting[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onUpdateMeeting: (id: string, updates: Partial<Meeting>) => void;
  onOpenSettings: () => void;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#71717a', // zinc
];

export function Sidebar({ meetings, activeId, onSelect, onCreate, onUpdateMeeting, onOpenSettings }: SidebarProps) {
  const cycleColor = (e: React.MouseEvent, meeting: Meeting) => {
    e.stopPropagation();
    const currentColor = meeting.ribbonColor || 'transparent';
    const currentIndex = COLORS.indexOf(currentColor);
    const nextColor = COLORS[(currentIndex + 1) % COLORS.length];
    onUpdateMeeting(meeting.id, { ribbonColor: nextColor });
  };

  const toggleObfuscate = (e: React.MouseEvent, meeting: Meeting) => {
    e.stopPropagation();
    onUpdateMeeting(meeting.id, { isObfuscated: !meeting.isObfuscated });
  };

  return (
    <div className="w-64 border-r border-zinc-200 bg-zinc-50/50 flex flex-col h-screen">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
        <h1 className="font-semibold text-zinc-800 text-sm tracking-tight flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-500" />
          Companion
        </h1>
        <button 
          onClick={onCreate}
          className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors text-zinc-600"
          title="New Meeting"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelect(meeting.id)}
            className={cn(
              "w-full text-left px-3 py-3 border-l-4 transition-all group flex flex-col gap-1 cursor-pointer relative",
              activeId === meeting.id 
                ? "bg-zinc-100" 
                : "border-transparent hover:bg-zinc-100/50"
            )}
            style={{ borderLeftColor: meeting.ribbonColor || (activeId === meeting.id ? '#27272a' : 'transparent') }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={cn("text-sm font-medium truncate flex-1", meeting.isObfuscated ? "blur-sm opacity-60 select-none" : "text-zinc-800")}>
                {meeting.isObfuscated ? "Hidden Title" : (meeting.title || "Untitled Meeting")}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => toggleObfuscate(e, meeting)} 
                  className="p-1 hover:bg-zinc-200 rounded text-zinc-500 hover:text-zinc-800"
                  title="Obfuscate Title"
                >
                  {meeting.isObfuscated ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button 
                  onClick={(e) => cycleColor(e, meeting)} 
                  className="w-4 h-4 rounded-sm border border-black/10 shadow-sm"
                  style={{ backgroundColor: meeting.ribbonColor || '#e4e4e7' }}
                  title="Cycle Color"
                />
              </div>
            </div>
            <div className="text-xs text-zinc-500 flex items-center justify-between">
              {format(meeting.createdAt, 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-zinc-200">
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-full p-2 rounded-md hover:bg-zinc-100"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
