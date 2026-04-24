'use client';

import { useState, useEffect, useCallback } from 'react';
import { Timer, Hash, Table as TableIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import Spreadsheet from './Spreadsheet';
import Settings from './Settings';

type Tab = 'counter' | 'stopwatch' | 'sheet' | 'settings';

export default function UtilityHub() {
  const [activeTab, setActiveTab] = useState<Tab>('counter');
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('utility-hub-haptics');
      return saved !== 'false';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('utility-hub-haptics', hapticsEnabled.toString());
  }, [hapticsEnabled]);

  const triggerHaptic = useCallback(() => {
    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [hapticsEnabled]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered: ', registration);
          },
          (registrationError) => {
            console.log('SW registration failed: ', registrationError);
          }
        );
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-black text-white overflow-hidden max-w-[480px] mx-auto relative md:rounded-[3rem] md:border-[8px] border-neutral-900 shadow-2xl">
      <header className="px-6 pt-10 pb-4 shrink-0 flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">Utility Duo</h1>
        <div className="flex gap-1.5 opacity-40">
          <div className="w-4 h-4 rounded-full bg-white/10" />
          <div className="w-4 h-4 rounded-full bg-white/10" />
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'counter' && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Counter onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Stopwatch onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'sheet' && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Spreadsheet onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Settings haptics={hapticsEnabled} setHaptics={setHapticsEnabled} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar */}
      <footer className="h-24 bg-neutral-900/80 backdrop-blur-2xl border-t border-neutral-800/50 flex justify-around items-center px-4 z-20 shrink-0 pb-4">
        <button
          onClick={() => { setActiveTab('counter'); triggerHaptic(); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'counter' ? 'text-cyan-400' : 'text-neutral-500 opacity-60'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'counter' ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}>
            <Hash size={20} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Count</span>
        </button>

        <button
          onClick={() => { setActiveTab('stopwatch'); triggerHaptic(); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'stopwatch' ? 'text-cyan-400' : 'text-neutral-500 opacity-60'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'stopwatch' ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}>
            <Timer size={20} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Time</span>
        </button>

        <button
          onClick={() => { setActiveTab('sheet'); triggerHaptic(); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'sheet' ? 'text-cyan-400' : 'text-neutral-500 opacity-60'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'sheet' ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}>
            <TableIcon size={20} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Data</span>
        </button>

        <button
          onClick={() => { setActiveTab('settings'); triggerHaptic(); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            activeTab === 'settings' ? 'text-cyan-400' : 'text-neutral-500 opacity-60'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'settings' ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}>
            <SettingsIcon size={20} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">App</span>
        </button>
      </footer>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full hidden md:block" />
    </div>
  );
}
