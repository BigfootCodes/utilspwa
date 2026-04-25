'use client';

import { useState } from 'react';
import { Minus, Plus, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function Counter({ onAction }: { onAction?: () => void }) {
  const [count, setCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('counterValue');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const updateCount = (newCount: number) => {
    onAction?.();
    setCount(newCount);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('counterValue', newCount.toString());
    }
  };

  const increment = () => updateCount(count + 1);
  const decrement = () => {
    onAction?.();
    if (count > 0) {
      setCount(count - 1);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('counterValue', (count - 1).toString());
      }
    }
  };
  const reset = () => updateCount(0);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative px-6 pt-8 pb-24">
      <div className="mb-6 shrink-0">
        <h1 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Counter</h1>
      </div>

      <section className="flex-1 flex flex-col items-center justify-center relative min-h-0">
        <div className="bg-[#e2e2e5] dark:bg-[#252828]/80 backdrop-blur-3xl border border-[#c1c8c8] dark:border-[#444747]/50 rounded-[3rem] p-6 w-full max-h-[360px] aspect-square flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 dark:from-white/5 to-transparent pointer-events-none rounded-t-[3rem]" />
          
          <motion.div 
            key={count}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="text-[90px] sm:text-[120px] leading-[1] font-bold text-[#001618] dark:text-[#f0f0f3] tracking-tighter select-none tabular-nums z-10 transition-transform duration-300 transform group-active:scale-95"
          >
            {count.toLocaleString()}
          </motion.div>
          
          <div className="text-[12px] font-semibold text-[#414848] dark:text-[#8c8f8e] uppercase tracking-widest mt-4 opacity-70">
            Current Count
          </div>
        </div>
      </section>

      <section className="mt-8 shrink-0 flex flex-col gap-6 w-full items-center">
        <div className="flex items-center justify-center gap-6 w-full max-w-[320px]">
          <button 
            onClick={decrement}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#eeeef0] dark:bg-[#2a2c2d] border border-[#c1c8c8]/50 dark:border-[#444747] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#001618] dark:text-[#f0f0f3] hover:bg-[#e2e2e5] dark:hover:bg-[#353738] active:scale-95 transition-all duration-200"
          >
            <Minus size={28} />
          </button>
          
          <button 
            onClick={increment}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0d2c2e] dark:bg-[#0d2c2e] text-white shadow-[0_8px_30px_rgba(13,44,46,0.3)] dark:shadow-[0_8px_30px_rgba(13,44,46,0.5)] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            <Plus size={36} />
          </button>
        </div>

        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#717879]/30 dark:border-[#444747] text-[#414848] dark:text-[#c4c7c6] hover:bg-[#e2e2e5]/50 dark:hover:bg-[#2a2c2d] active:scale-95 transition-all duration-200 text-[16px] font-semibold"
        >
          <RefreshCcw size={20} />
          Reset Counter
        </button>
      </section>
    </div>
  );
}
