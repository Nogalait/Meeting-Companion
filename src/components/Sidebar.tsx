import React, { useState, useRef, useEffect } from 'react';
import { Meeting } from '../types';
import { format } from 'date-fns';
import { Plus, Settings, FileText, EyeOff, Eye, Check } from 'lucide-react';
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
  '#c084fc', '#60a5fa', '#4ade80', '#38bdf8', '#facc15', '#f87171', '#9ca3af',
  '#9333ea', '#2563eb', '#16a34a', '#0ea5e9', '#d97706', '#dc2626', '#4b5563'
];

export function Sidebar({ meetings, activeId, onSelect, onCreate, onUpdateMeeting, onOpenSettings }: SidebarProps) {
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      setColorPickerId(null);
    };
    if (colorPickerId) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [colorPickerId]);

  const toggleColorPicker = (e: React.MouseEvent, meetingId: string) => {
    e.stopPropagation();
    setColorPickerId(prev => prev === meetingId ? null : meetingId);
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
                  onClick={(e) => toggleColorPicker(e, meeting.id)} 
                  className={cn("w-4 h-4 rounded-sm border border-black/10 shadow-sm relative", colorPickerId === meeting.id && "ring-2 ring-blue-500 ring-offset-1")}
                  style={{ backgroundColor: meeting.ribbonColor || '#e4e4e7' }}
                  title="Choose Color"
                >
                  {colorPickerId === meeting.id && (
                    <div 
                      className="absolute top-full right-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-zinc-200 z-[60] grid grid-cols-7 gap-1.5 w-[220px]"
                      onClick={e => e.stopPropagation()}
                    >
                      {COLORS.map(c => (
                        <button 
                          key={c}
                          className={cn("w-6 h-6 rounded-md border border-black/10 flex items-center justify-center transition-transform hover:scale-110", meeting.ribbonColor === c ? "ring-2 ring-blue-500 ring-offset-1" : "")}
                          style={{ backgroundColor: c }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateMeeting(meeting.id, { ribbonColor: c });
                            setColorPickerId(null);
                          }}
                        >
                          {meeting.ribbonColor === c && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div className="text-xs text-zinc-500 flex items-center justify-between">
              {format(meeting.createdAt, 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-zinc-200">
        <button onClick={onOpenSettings} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-full p-2 rounded-md hover:bg-zinc-100">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
