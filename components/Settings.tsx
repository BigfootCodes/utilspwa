'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Vibrate, Database, ChevronRight, X, Trash2, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  haptics: boolean;
  setHaptics: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onAction?: () => void;
}

export default function Settings({ haptics, setHaptics, isDarkMode, setIsDarkMode, onAction }: SettingsProps) {
  const [showDataModal, setShowDataModal] = useState(false);

  const taskCount = useLiveQuery(() => db.tasks.count(), []) || 0;
  const ledgerCount = useLiveQuery(() => db.ledger.count(), []) || 0;
  const cashCount = useLiveQuery(() => db.cashDeposits.count(), []) || 0;

  const handleClearData = async (store: 'tasks' | 'ledger' | 'cashDeposits') => {
    if (confirm(`Are you sure you want to clear all data in ${store}?`)) {
      await db[store].clear();
    }
  };

  return (
    <div className="flex flex-col min-h-full max-w-md mx-auto pt-12 pb-32 px-6 space-y-8 font-['Inter']">
      
      <div className="mb-8">
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Settings</h2>
      </div>

      <div className="space-y-2">
        <p className="px-4 text-[12px] font-semibold uppercase tracking-wider text-[#8c8f8e]">App Experience</p>
        <section className="bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border border-black/[0.05] dark:border-[#444747] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
          <div className="divide-y divide-black/[0.05] dark:divide-[#444747]">
            <div 
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] dark:bg-[#1e293b] flex items-center justify-center">
                  {isDarkMode ? <Moon size={18} className="text-[#fbbf24]" /> : <Sun size={18} className="text-[#f59e0b]" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] text-[#001618] dark:text-[#f0f0f3]">Dark Mode</span>
                  <span className="text-[12px] text-[#414848] dark:text-[#8c8f8e]">Midnight Slate theme</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDarkMode}
                  onChange={() => { onAction?.(); setIsDarkMode(!isDarkMode); }}
                />
                <div className="w-11 h-6 bg-[#e2e8f0] dark:bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d2c2e]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#cee2f6]/50 flex items-center justify-center">
                  <Vibrate size={18} className="text-[#4d6072]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] text-[#001618] dark:text-[#f0f0f3]">Haptic Feedback</span>
                  <span className="text-[12px] text-[#414848] dark:text-[#8c8f8e]">Tactile touch responses</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={haptics}
                  onChange={(e) => { onAction?.(); setHaptics(e.target.checked); }}
                />
                <div className="w-11 h-6 bg-[#dadadc] dark:bg-[#444747] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cee2f6] dark:peer-checked:bg-[#0d2c2e]"></div>
              </label>
            </div>
            
            <div 
              onClick={() => { onAction?.(); setShowDataModal(true); }}
              className="flex items-center justify-between p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9e8eb] dark:bg-[#0d2c2e] flex items-center justify-center">
                  <Database size={18} className="text-[#2e4c4e] dark:text-[#adccce]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] text-[#001618] dark:text-[#f0f0f3]">Data Management</span>
                  <span className="text-[12px] text-[#414848] dark:text-[#8c8f8e]">Manage local storage</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#8c8f8e]" />
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showDataModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { onAction?.(); setShowDataModal(false); }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1c1e] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-black/[0.05] dark:border-[#444747] flex justify-between items-center bg-[#f9f9fc] dark:bg-[#252828]">
                <h3 className="text-lg font-bold text-[#001618] dark:text-[#f0f0f3]">Data Management</h3>
                <button onClick={() => { onAction?.(); setShowDataModal(false); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[#414848] dark:text-[#8c8f8e]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#414848] dark:text-[#8c8f8e] mb-4">Your data is stored locally on this device using IndexedDB.</p>
                
                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] dark:bg-[#252828] rounded-xl border border-black/[0.05] dark:border-[#444747]">
                  <div>
                    <h4 className="font-semibold text-[#001618] dark:text-[#f0f0f3]">Data (Spreadsheet)</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{taskCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('tasks'); }}
                    disabled={taskCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] dark:bg-[#252828] rounded-xl border border-black/[0.05] dark:border-[#444747]">
                  <div>
                    <h4 className="font-semibold text-[#001618] dark:text-[#f0f0f3]">Expenses (Ledger)</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{ledgerCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('ledger'); }}
                    disabled={ledgerCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] dark:bg-[#252828] rounded-xl border border-black/[0.05] dark:border-[#444747]">
                  <div>
                    <h4 className="font-semibold text-[#001618] dark:text-[#f0f0f3]">Cash Deposits</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{cashCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('cashDeposits'); }}
                    disabled={cashCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
