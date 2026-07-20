import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Plus, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

// Simple beep using Web Audio API
const playBeep = (freq: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error("Audio API error", e);
  }
};

const play5MinCue = () => {
  playBeep(440, 0.5); 
  setTimeout(() => playBeep(523.25, 0.5), 500); 
};

const play30sCue = () => {
  playBeep(880, 0.2, 'square');
  setTimeout(() => playBeep(880, 0.2, 'square'), 300);
  setTimeout(() => playBeep(880, 0.2, 'square'), 600);
};

interface TimerProps {
  initialSeconds: number;
}

export function Timer({ initialSeconds }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(Math.floor(initialSeconds / 60));

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setInputMinutes(Math.floor(initialSeconds / 60));
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next === 300) play5MinCue();
          if (next === 30) play30sCue();
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(inputMinutes * 60);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    setIsRunning(false);
    setTimeLeft(inputMinutes * 60);
  };

  const addTime = (minutes: number) => {
    setTimeLeft(prev => Math.max(0, prev + minutes * 60));
    setInputMinutes(prev => Math.max(1, prev + minutes));
  };

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  const isLast30s = isRunning && timeLeft <= 30 && timeLeft > 0;

  return (
    <div className={cn(
      "flex items-center gap-3.5 px-4 py-2 rounded-full border shadow-sm transition-all scale-110 origin-right",
      isLast30s ? "bg-red-50 border-red-200 animate-pulse text-red-700" : "bg-zinc-100 border-zinc-200"
    )}>
      <Clock className={cn("w-4.5 h-4.5", isLast30s ? "text-red-500" : "text-zinc-400")} />
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input 
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            className="w-16 bg-white border border-zinc-300 rounded px-2 py-0.5 text-base outline-none focus:border-zinc-500"
            min="1"
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <span className="text-sm font-medium">min</span>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className={cn(
            "font-mono text-base font-medium cursor-pointer w-14 text-center transition-colors",
            isLast30s ? "text-red-600 font-bold" : "text-zinc-700 hover:text-zinc-900"
          )}
        >
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
      )}

      <div className={cn("flex items-center gap-1 border-l pl-2", isLast30s ? "border-red-200" : "border-zinc-300")}>
        <button onClick={() => addTime(-1)} className="p-1 hover:bg-black/5 rounded transition-colors" title="-1 Min">
          <Minus className="w-4 h-4" />
        </button>
        <button onClick={() => addTime(1)} className="p-1 hover:bg-black/5 rounded transition-colors" title="+1 Min">
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-black/10 mx-1"></div>
        <button onClick={toggle} className="p-1 hover:bg-black/5 rounded transition-colors">
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={reset} className="p-1 hover:bg-black/5 rounded transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
