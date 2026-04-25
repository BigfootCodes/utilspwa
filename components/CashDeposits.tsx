'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Banknote, History, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function CashDeposits({ onAction }: { onAction?: () => void }) {
  const [b500, setB500] = useState('');
  const [b200, setB200] = useState('');
  const [b100, setB100] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [selectedBreakdown, setSelectedBreakdown] = useState<{ date: string, breakdown: any, total: number } | null>(null);

  const deposits = useLiveQuery(() => db.cashDeposits.orderBy('date').reverse().toArray(), []);

  const val500 = parseInt(b500) || 0;
  const val200 = parseInt(b200) || 0;
  const val100 = parseInt(b100) || 0;
  const currentTotal = (val500 * 500) + (val200 * 200) + (val100 * 100);

  const handleRecordDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTotal === 0 || !date) return;
    
    onAction?.();
    await db.cashDeposits.add({
      id: crypto.randomUUID(),
      date,
      total: currentTotal,
      breakdown: {
        b500: val500,
        b200: val200,
        b100: val100
      }
    });

    setB500('');
    setB200('');
    setB100('');
  };

  return (
    <div className="flex flex-col min-h-full pb-32 max-w-md mx-auto px-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1c1e]">Cash</h2>
        <p className="text-[#414848] text-[15px] mt-1">Calculate and track cash deposits</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden mb-6">
        <section className="p-6 border-b border-black/[0.05]">
          <div className="flex items-center gap-2 mb-6">
            <Banknote className="text-[#001618] fill-[#001618]/10" />
            <h3 className="text-[22px] font-semibold text-[#001618]">Deposit Calculator</h3>
          </div>
          
          <form onSubmit={handleRecordDeposit} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 text-right font-medium text-[#414848]">500 ×</div>
                <input 
                  type="number"
                  min="0"
                  value={b500}
                  onChange={(e) => setB500(e.target.value)}
                  className="flex-1 bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 text-[#1a1c1e] text-center outline-none"
                  placeholder="0"
                />
                <div className="w-24 text-right font-bold text-[#001618]">${(val500 * 500).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-right font-medium text-[#414848]">200 ×</div>
                <input 
                  type="number"
                  min="0"
                  value={b200}
                  onChange={(e) => setB200(e.target.value)}
                  className="flex-1 bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 text-[#1a1c1e] text-center outline-none"
                  placeholder="0"
                />
                <div className="w-24 text-right font-bold text-[#001618]">${(val200 * 200).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-right font-medium text-[#414848]">100 ×</div>
                <input 
                  type="number"
                  min="0"
                  value={b100}
                  onChange={(e) => setB100(e.target.value)}
                  className="flex-1 bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 text-[#1a1c1e] text-center outline-none"
                  placeholder="0"
                />
                <div className="w-24 text-right font-bold text-[#001618]">${(val100 * 100).toLocaleString()}</div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-black/[0.05] flex justify-between items-center">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#414848]">Total Deposit</span>
              <span className="text-[28px] font-bold text-[#001618]">${currentTotal.toLocaleString()}</span>
            </div>
            
            <div className="pt-2">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] px-1 block mb-1">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 transition-all text-[#1a1c1e] text-[15px] outline-none"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={currentTotal === 0}
              className="w-full bg-[#0d2c2e] text-white font-semibold text-[16px] py-4 rounded-xl active:scale-95 transition-all mt-4 shadow-md shadow-[#0d2c2e]/20 disabled:opacity-50 disabled:active:scale-100"
            >
              Record Deposit
            </button>
          </form>
        </section>

        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="text-[#001618]" />
              <h3 className="text-[22px] font-semibold text-[#001618]">History</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/[0.03]">
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-[#414848]">Date</th>
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-[#414848] text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {deposits?.map(dep => (
                  <tr key={dep.id} className="group">
                    <td className="py-4">
                      <button 
                        onClick={() => { onAction?.(); setSelectedBreakdown({ date: dep.date, breakdown: dep.breakdown, total: dep.total }); }}
                        className="text-[#414848] text-[15px] hover:text-[#0d2c2e] hover:underline"
                      >
                        {new Date(dep.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </button>
                    </td>
                    <td className="py-4 text-right font-semibold text-[#001618] text-[15px]">
                      ${dep.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {deposits?.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-[#8c8f8e] text-sm">No deposits recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedBreakdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { onAction?.(); setSelectedBreakdown(null); }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#001618]">Deposit Breakdown</h3>
                <button onClick={() => { onAction?.(); setSelectedBreakdown(null); }} className="p-2 hover:bg-black/5 rounded-full text-[#414848]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[#414848] font-medium">
                  <span>500 × {selectedBreakdown.breakdown.b500}</span>
                  <span>${(selectedBreakdown.breakdown.b500 * 500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#414848] font-medium">
                  <span>200 × {selectedBreakdown.breakdown.b200}</span>
                  <span>${(selectedBreakdown.breakdown.b200 * 200).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#414848] font-medium">
                  <span>100 × {selectedBreakdown.breakdown.b100}</span>
                  <span>${(selectedBreakdown.breakdown.b100 * 100).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-black/[0.05] flex justify-between items-center">
                <span className="font-semibold text-[#001618]">Total</span>
                <span className="text-2xl font-bold text-[#001618]">${selectedBreakdown.total.toLocaleString()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
