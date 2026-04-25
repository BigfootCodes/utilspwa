'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

export default function Stopwatch({ onAction }: { onAction?: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const toggleTimer = () => {
    onAction?.();
    if (isRunning) {
      setIsRunning(false);
    } else {
      setStartTime(Date.now() - time);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    onAction?.();
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
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

  return (
    <div className="flex flex-col h-full px-6 pt-8 pb-24 max-w-md mx-auto w-full">
      <div className="mb-6 shrink-0">
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Timer</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center relative mb-12">
          <div className="absolute inset-2 rounded-full border border-[#c1c8c8] dark:border-[#444747]/50" />

          <div className="text-[40px] sm:text-[48px] font-bold text-[#1a1c1e] dark:text-[#f0f0f3] tracking-tighter tabular-nums flex items-baseline">
            <span>{minStr}</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] mx-1">:</span>
            <span>{secStr}</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] mx-1 text-2xl">.</span>
            <span className="text-[#414848] dark:text-[#8c8f8e] text-[28px] font-semibold">{cSecStr}</span>
          </div>

          <div className="mt-2 text-[12px] font-semibold uppercase tracking-widest text-[#4d6072] dark:text-[#8c9ba8]">
            Elapsed Time
          </div>
        </div>

        <div className="flex justify-center items-center gap-10 w-full shrink-0">
          <button
            onClick={resetTimer}
            className="w-20 h-20 rounded-full bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border-[0.5px] border-black/[0.05] dark:border-[#444747] shadow-sm flex flex-col items-center justify-center text-[#414848] dark:text-[#8c8f8e] active:scale-95 transition-transform"
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
        </div>
      </div>
    </div>
  );
}
