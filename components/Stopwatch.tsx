'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Play, Pause, Flag } from 'lucide-react';

interface Lap {
  id: string;
  time: number;
  overallTime: number;
}

export default function Stopwatch({ onAction }: { onAction?: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    onAction?.();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    onAction?.();
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    onAction?.();
    const currentLapTime = laps.length === 0 ? time : time - laps[laps.length - 1].overallTime;
    setLaps([...laps, { id: crypto.randomUUID(), time: currentLapTime, overallTime: time }]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return {
      minStr: minutes.toString().padStart(2, '0'),
      secStr: seconds.toString().padStart(2, '0'),
      cSecStr: centiseconds.toString().padStart(2, '0')
    };
  };

  const { minStr, secStr, cSecStr } = formatTime(time);

  // Find the fastest lap
  const bestLapIndex = laps.length > 1 ? laps.reduce((bestIdx, curr, idx, arr) => curr.time < arr[bestIdx].time ? idx : bestIdx, 0) : -1;

  return (
    <div className="flex flex-col min-h-full pt-12 px-6 max-w-md mx-auto w-full pb-32">
      <div className="mb-8">
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Timer</h2>
      </div>

      <div className="flex flex-col items-center justify-center mb-12 relative">
        <div className="w-64 h-64 rounded-full bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center relative">
          <div className="absolute inset-2 rounded-full border border-[#c1c8c8] dark:border-[#444747]/50" />
          
          <div className="text-[34px] font-bold text-[#1a1c1e] dark:text-[#f0f0f3] tracking-tighter tabular-nums flex items-baseline">
            <span>{minStr}</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] mx-1">:</span>
            <span>{secStr}</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] mx-1 text-2xl">.</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] text-[22px] font-semibold">{cSecStr}</span>
          </div>
          
          <div className="mt-2 text-[12px] font-semibold uppercase tracking-widest text-[#4d6072] dark:text-[#8c9ba8] flex items-center gap-1">
            <Flag size={14} /> Lap {laps.length + 1}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-12 px-4">
        <button 
          onClick={resetTimer}
          className="w-20 h-20 rounded-full bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] flex flex-col items-center justify-center text-[#414848] dark:text-[#8c8f8e] active:scale-95 transition-transform"
        >
          <RotateCcw size={24} className="mb-1" />
          <span className="text-[12px] font-semibold uppercase tracking-wider">Reset</span>
        </button>
        
        <button 
          onClick={toggleTimer}
          className="w-24 h-24 rounded-full bg-[#0d2c2e] text-white shadow-lg shadow-[#0d2c2e]/20 flex flex-col items-center justify-center active:scale-95 transition-transform border-4 border-[#f9f9fc] dark:border-[#101413]"
        >
          {isRunning ? (
            <Pause size={32} className="mb-1 fill-white" />
          ) : (
            <Play size={32} className="mb-1 ml-1 fill-white" />
          )}
          <span className="text-[12px] font-semibold uppercase tracking-wider">{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        
        <button 
          onClick={addLap}
          disabled={!isRunning}
          className="w-20 h-20 rounded-full bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] flex flex-col items-center justify-center text-[#414848] dark:text-[#8c8f8e] active:scale-95 transition-transform disabled:opacity-50"
        >
          <Flag size={24} className="mb-1" />
          <span className="text-[12px] font-semibold uppercase tracking-wider">Lap</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] rounded-t-2xl overflow-hidden border-b-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-3 px-6 py-4 border-b border-black/[0.05] dark:border-[#444747] bg-[#dadadc]/30 dark:bg-[#252828]">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8]">Lap</div>
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8] text-center">Lap Time</div>
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8] text-right">Overall</div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {[...laps].reverse().map((lap, reversedIdx) => {
            const actualIdx = laps.length - 1 - reversedIdx;
            const isBest = actualIdx === bestLapIndex;
            const fLap = formatTime(lap.time);
            const fOverall = formatTime(lap.overallTime);
            
            return (
              <div 
                key={lap.id} 
                className={`grid grid-cols-3 py-3 border-b border-black/[0.03] dark:border-[#444747]/30 text-[15px] items-center ${isBest ? 'bg-[#c9e8eb]/20 dark:bg-[#0d2c2e]/30 -mx-6 px-6 text-[#0d2c2e] dark:text-[#adccce]' : 'text-[#414848] dark:text-[#c4c7c6]'}`}
              >
                <div className="flex items-center gap-2">
                  <span>{(actualIdx + 1).toString().padStart(2, '0')}</span>
                  {isBest && <span className="text-[14px]">★</span>}
                </div>
                <div className={`text-center tabular-nums ${isBest ? 'font-medium' : ''}`}>
                  {fLap.minStr}:{fLap.secStr}.{fLap.cSecStr}
                </div>
                <div className={`text-right tabular-nums ${isBest ? '' : 'font-medium text-[#1a1c1e] dark:text-[#f0f0f3]'}`}>
                  {fOverall.minStr}:{fOverall.secStr}.{fOverall.cSecStr}
                </div>
              </div>
            );
          })}
          {laps.length === 0 && (
            <div className="py-8 text-center text-[#8c8f8e] dark:text-[#8c8f8e] text-sm">No laps recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
