'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lap {
  id: number;
  time: number;
  formatted: string;
  delta: string;
}

interface StopwatchProps {
  onAction?: () => void;
}

export default function Stopwatch({ onAction }: StopwatchProps) {
  const [time, setTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('utility-hub-stopwatch-time');
      return savedTime ? parseInt(savedTime, 10) : 0;
    }
    return 0;
  });
  const [isActive, setIsActive] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>(() => {
    if (typeof window !== 'undefined') {
      const savedLaps = localStorage.getItem('utility-hub-stopwatch-laps');
      return savedLaps ? JSON.parse(savedLaps) : [];
    }
    return [];
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('utility-hub-stopwatch-time', time.toString());
    localStorage.setItem('utility-hub-stopwatch-laps', JSON.stringify(laps));
  }, [time, laps]);

  const formatTimeParts = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return {
      main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:`,
      ms: centiseconds.toString().padStart(2, '0')
    };
  }, []);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  const toggle = () => {
    onAction?.();
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    onAction?.();
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (!isActive) return;
    onAction?.();
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const deltaMs = time - lastLapTime;
    
    const newLap: Lap = {
      id: Date.now(),
      time: time,
      formatted: formatTime(time),
      delta: `+${formatTime(deltaMs)}`
    };
    
    setLaps((prev) => [newLap, ...prev]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const timeParts = formatTimeParts(time);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col items-center justify-center pt-10 pb-8 shrink-0">
        <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-semibold mb-2">
          Stopwatch
        </span>
        <div className="text-7xl font-light text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          {timeParts.main}<span className="text-3xl text-neutral-600">{timeParts.ms}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 mb-8 shrink-0">
        <button
          id="stopwatch-toggle"
          onClick={toggle}
          className={`h-20 rounded-[2rem] font-bold transition-all active:scale-95 flex items-center justify-center text-[11px] tracking-[0.2em] border-2 ${
            isActive 
              ? 'bg-white/5 text-white border-white/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
          }`}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>

        <button
          id="stopwatch-lap"
          onClick={addLap}
          disabled={!isActive}
          className={`h-20 rounded-[2rem] font-bold transition-all active:scale-95 flex items-center justify-center text-[11px] tracking-[0.2em] border-2 ${
            !isActive 
              ? 'bg-white/5 text-white/5 border-white/5 cursor-not-allowed' 
              : 'bg-white/10 text-white border-white/20'
          }`}
        >
          LAP
        </button>

        <button
          id="stopwatch-reset"
          onClick={reset}
          className="col-span-2 h-16 rounded-2xl bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 active:scale-95 transition-transform flex items-center justify-center text-[10px] tracking-[0.3em]"
        >
          RESET
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-6">
        <div className="flex justify-between items-end mb-3 border-b border-neutral-800 pb-2">
          <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Laps</h3>
          <span className="text-[10px] text-neutral-600">Session History</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <AnimatePresence initial={false}>
            {laps.map((lap, index) => (
              <motion.div
                key={lap.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-between py-4 border-b border-neutral-900/50"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600">Lap {laps.length - index}</span>
                  <span className="text-sm font-mono text-white mt-1">{lap.formatted}</span>
                </div>
                <div className="flex flex-col items-end justify-end">
                  <span className="text-[10px] font-mono text-zinc-600">{lap.delta}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {laps.length === 0 && (
            <div className="h-full flex items-center justify-center py-20 opacity-10 flex-col gap-4">
              <div className="w-12 h-[1px] bg-white" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-center">
                Awaiting Data
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
