'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Vibrate, Database, ChevronRight, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  haptics: boolean;
  setHaptics: (val: boolean) => void;
  onAction?: () => void;
}

export default function Settings({ haptics, setHaptics, onAction }: SettingsProps) {
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
      
      <div className="text-center mb-4">
        <h2 className="text-[28px] font-bold text-[#1a1c1e]">Settings</h2>
      </div>

      <div className="space-y-2">
        <p className="px-4 text-[12px] font-semibold uppercase tracking-wider text-[#8c8f8e]">App Experience</p>
        <section className="bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden">
          <div className="divide-y divide-black/[0.05]">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#cee2f6]/50 flex items-center justify-center">
                  <Vibrate size={18} className="text-[#4d6072]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] text-[#001618]">Haptic Feedback</span>
                  <span className="text-[12px] text-[#414848]">Tactile touch responses</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={haptics}
                  onChange={(e) => { onAction?.(); setHaptics(e.target.checked); }}
                />
                <div className="w-11 h-6 bg-[#dadadc] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cee2f6]"></div>
              </label>
            </div>
            
            <div 
              onClick={() => { onAction?.(); setShowDataModal(true); }}
              className="flex items-center justify-between p-4 hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9e8eb] flex items-center justify-center">
                  <Database size={18} className="text-[#2e4c4e]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] text-[#001618]">Data Management</span>
                  <span className="text-[12px] text-[#414848]">Manage local storage</span>
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
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-black/[0.05] flex justify-between items-center bg-[#f9f9fc]">
                <h3 className="text-lg font-bold text-[#001618]">Data Management</h3>
                <button onClick={() => { onAction?.(); setShowDataModal(false); }} className="p-2 hover:bg-black/5 rounded-full text-[#414848]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#414848] mb-4">Your data is stored locally on this device using IndexedDB.</p>
                
                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] rounded-xl border border-black/[0.05]">
                  <div>
                    <h4 className="font-semibold text-[#001618]">Data (Spreadsheet)</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{taskCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('tasks'); }}
                    disabled={taskCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] rounded-xl border border-black/[0.05]">
                  <div>
                    <h4 className="font-semibold text-[#001618]">Expenses (Ledger)</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{ledgerCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('ledger'); }}
                    disabled={ledgerCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3f6] rounded-xl border border-black/[0.05]">
                  <div>
                    <h4 className="font-semibold text-[#001618]">Cash Deposits</h4>
                    <p className="text-xs text-[#8c8f8e] mt-0.5">{cashCount} records stored</p>
                  </div>
                  <button 
                    onClick={() => { onAction?.(); handleClearData('cashDeposits'); }}
                    disabled={cashCount === 0}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
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
