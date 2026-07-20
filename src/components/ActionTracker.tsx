import React, { useState } from 'react';
import { ActionItem } from '../types';
import { Plus, Check, Circle, Trash2, Calendar, User } from 'lucide-react';
import { cn } from '../utils/cn';

interface ActionTrackerProps {
  actions: ActionItem[];
  onChange: (actions: ActionItem[]) => void;
}

export function ActionTracker({ actions, onChange }: ActionTrackerProps) {
  const [newAction, setNewAction] = useState("");
  const [newDriver, setNewDriver] = useState("");
  const [newTimeline, setNewTimeline] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    const item: ActionItem = {
      id: crypto.randomUUID(),
      action: newAction,
      driver: newDriver || "Unassigned",
      timeline: newTimeline || "TBD",
      completed: false,
    };
    onChange([...actions, item]);
    setNewAction("");
    setNewDriver("");
    setNewTimeline("");
  };

  const toggleComplete = (id: string) => {
    onChange(actions.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const removeAction = (id: string) => {
    onChange(actions.filter(a => a.id !== id));
  };

  return (
    <div className="w-full border-t border-zinc-100 pt-8 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
        Action Items
      </h2>

      <div className="space-y-3 mb-6">
        {actions.length === 0 && (
          <p className="text-sm text-zinc-400 italic">No actions recorded yet.</p>
        )}
        {actions.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "group flex items-start gap-3 p-3 rounded-lg border transition-all",
              item.completed ? "bg-zinc-50 border-zinc-200/60" : "bg-white border-zinc-200 shadow-sm"
            )}
          >
            <button onClick={() => toggleComplete(item.id)} className="mt-0.5 text-zinc-400 hover:text-zinc-600 transition-colors">
              {item.completed ? <Check className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium transition-all break-words", item.completed ? "text-zinc-400 line-through" : "text-zinc-800")}>
                {item.action}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.driver}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.timeline}</span>
              </div>
            </div>
            <button 
              onClick={() => removeAction(item.id)}
              className="text-zinc-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <input 
              type="text" 
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={newDriver}
              onChange={(e) => setNewDriver(e.target.value)}
              placeholder="Driver (Who?)"
              className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={newTimeline}
              onChange={(e) => setNewTimeline(e.target.value)}
              placeholder="Timeline (When?)"
              className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <button 
            type="submit"
            disabled={!newAction.trim()}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Action
          </button>
        </div>
      </form>
    </div>
  );
}
