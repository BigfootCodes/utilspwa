'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Counter from './Counter';
import Stopwatch from './Stopwatch';
import Spreadsheet from './Spreadsheet';
import Ledger from './Ledger';
import CashDeposits from './CashDeposits';
import Settings from './Settings';
import { Calculator, Clock, Database, Banknote, Receipt, Settings as SettingsIcon } from 'lucide-react';

type Tab = 'counter' | 'time' | 'data' | 'cash' | 'expenses' | 'settings';

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
    <div className="flex flex-col h-[100dvh] w-full bg-[#f9f9fc] text-[#1a1c1e] font-['Inter'] overflow-hidden relative">
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'counter' && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <Counter onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'time' && (
            <motion.div
              key="time"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <Stopwatch onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <Spreadsheet onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'cash' && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <CashDeposits onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <Ledger onAction={triggerHaptic} />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <Settings haptics={hapticsEnabled} setHaptics={setHapticsEnabled} onAction={triggerHaptic} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav Bar - Rounded Rectangle, Icons Only */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] rounded-3xl bg-white/80 backdrop-blur-2xl border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex justify-between items-center px-4 py-4 z-50">
        <button
          onClick={() => { setActiveTab('counter'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'counter' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <Calculator size={24} strokeWidth={activeTab === 'counter' ? 2.5 : 2} />
        </button>
        <button
          onClick={() => { setActiveTab('time'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'time' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <Clock size={24} strokeWidth={activeTab === 'time' ? 2.5 : 2} />
        </button>
        <button
          onClick={() => { setActiveTab('data'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'data' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <Database size={24} strokeWidth={activeTab === 'data' ? 2.5 : 2} />
        </button>
        <button
          onClick={() => { setActiveTab('cash'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'cash' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <Banknote size={24} strokeWidth={activeTab === 'cash' ? 2.5 : 2} />
        </button>
        <button
          onClick={() => { setActiveTab('expenses'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'expenses' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <Receipt size={24} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} />
        </button>
        <button
          onClick={() => { setActiveTab('settings'); triggerHaptic(); }}
          className={`flex items-center justify-center transition-all duration-200 active:scale-90 ${activeTab === 'settings' ? 'text-[#0d2c2e] scale-110' : 'text-slate-400 opacity-70 hover:opacity-100 hover:scale-105'}`}
        >
          <SettingsIcon size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
        </button>
      </nav>
    </div>
  );
}
