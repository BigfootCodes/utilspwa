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
    <div className="flex flex-col min-h-full max-w-md mx-auto relative px-6 py-12">
      <header className="flex items-center justify-center mb-12">
        <h1 className="text-[28px] font-bold text-[#0d2c2e] text-center">Counter</h1>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center relative">
        <div className="bg-[#e2e2e5]/30 backdrop-blur-3xl border border-[#c1c8c8]/30 rounded-[3rem] p-8 w-full aspect-square flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-[3rem]" />
          
          <motion.div 
            key={count}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="text-[120px] leading-[1] font-bold text-[#001618] tracking-tighter select-none tabular-nums z-10 transition-transform duration-300 transform group-active:scale-95"
          >
            {count.toLocaleString()}
          </motion.div>
          
          <div className="text-[12px] font-semibold text-[#414848] uppercase tracking-widest mt-4 opacity-70">
            Current Count
          </div>
        </div>
      </section>

      <section className="mt-12 pb-32 flex flex-col gap-8 w-full items-center">
        <div className="flex items-center justify-center gap-4 w-full max-w-[320px]">
          <button 
            onClick={decrement}
            className="w-20 h-20 rounded-full bg-[#eeeef0] border border-[#c1c8c8]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-center text-[#001618] hover:bg-[#e2e2e5] active:scale-95 transition-all duration-200"
          >
            <Minus size={32} />
          </button>
          
          <button 
            onClick={increment}
            className="w-24 h-24 rounded-full bg-[#0d2c2e] text-white shadow-[0_8px_30px_rgba(13,44,46,0.3)] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            <Plus size={40} />
          </button>
        </div>

        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#717879]/30 text-[#414848] hover:bg-[#e2e2e5]/50 active:scale-95 transition-all duration-200 text-[16px] font-semibold"
        >
          <RefreshCcw size={20} />
          Reset Counter
        </button>
      </section>
    </div>
  );
}
