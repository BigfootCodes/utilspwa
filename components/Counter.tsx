'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CounterProps {
  onAction?: () => void;
}

export default function Counter({ onAction }: CounterProps) {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('utility-hub-counter');
      return saved !== null ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('utility-hub-counter', count.toString());
  }, [count]);

  const increment = () => {
    setCount((prev) => prev + 1);
    onAction?.();
  };
  
  const decrement = () => {
    if (count > 0) {
      setCount((prev) => Math.max(0, prev - 1));
      onAction?.();
    }
  };

  const reset = () => {
    setCount(0);
    onAction?.();
  };

  return (
    <div className="flex flex-col items-center justify-around h-full py-12 px-6">
      <div className="text-center">
        <span className="block text-[11px] uppercase tracking-widest text-cyan-400 font-semibold mb-2">
          Total Count
        </span>
        <div className="relative py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ 
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
              className="text-9xl font-light text-white tracking-tighter tabular-nums"
            >
              {count}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[280px]">
        <div className="grid grid-cols-2 gap-4">
          <button
            id="counter-decrement"
            onClick={decrement}
            disabled={count === 0}
            className={`
              h-20 flex items-center justify-center rounded-[2rem] border transition-all active:scale-95
              ${count === 0 
                ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed' 
                : 'bg-zinc-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'}
            `}
          >
            <span className="text-4xl font-light">−</span>
          </button>

          <button
            id="counter-increment"
            onClick={increment}
            className="h-20 flex items-center justify-center rounded-[2rem] bg-white text-black transition-all hover:bg-neutral-200 active:scale-95"
          >
            <span className="text-4xl font-light">+</span>
          </button>
        </div>

        <button
          id="counter-reset"
          onClick={reset}
          className="h-16 flex items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-[0.2em] transition-all active:scale-95"
        >
          RESET
        </button>
      </div>

      <div className="opacity-10 flex flex-col items-center gap-1">
        <div className="w-12 h-[1px] bg-white" />
        <span className="text-[7px] font-mono uppercase tracking-[0.3em]">Device.Primary-01</span>
      </div>
    </div>
  );
}
