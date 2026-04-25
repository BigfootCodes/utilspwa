'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { PlusCircle, History, TrendingDown, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Ledger({ onAction }: { onAction?: () => void }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [selectedRemark, setSelectedRemark] = useState<{ date: string, remarks: string } | null>(null);

  const entries = useLiveQuery(() => db.ledger.orderBy('date').reverse().toArray(), []);

  const totalSpent = entries?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    
    onAction?.();
    await db.ledger.add({
      id: crypto.randomUUID(),
      date,
      amount: parseFloat(amount),
      category,
      remarks: description
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className="flex flex-col min-h-full pb-32 max-w-md mx-auto px-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1c1e]">Ledger</h2>
        <p className="text-[#414848] text-[15px] mt-1">Track and manage your daily expenses</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden mb-6">
        <section className="p-6 border-b border-black/[0.05]">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="text-[#001618] fill-[#001618]/10" />
            <h3 className="text-[22px] font-semibold text-[#001618]">New Expense</h3>
          </div>
          
          <form onSubmit={handleRecordExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] px-1">Description</label>
                <input 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 transition-all placeholder:text-[#414848]/40 text-[#1a1c1e] text-[15px] outline-none"
                  placeholder="e.g. Weekly Groceries"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] px-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414848]">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#f3f3f6] border-none rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 transition-all placeholder:text-[#414848]/40 text-[#1a1c1e] text-[15px] outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] px-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 transition-all text-[#1a1c1e] text-[15px] outline-none"
                >
                  <option>Groceries</option>
                  <option>Utilities</option>
                  <option>Entertainment</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] px-1">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 transition-all text-[#1a1c1e] text-[15px] outline-none"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#001618] text-white font-semibold text-[16px] py-4 rounded-xl active:scale-95 transition-all mt-2 shadow-md shadow-[#001618]/10">
              Record Expense
            </button>
          </form>
        </section>

        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="text-[#001618]" />
              <h3 className="text-[22px] font-semibold text-[#001618]">History</h3>
            </div>
            <button className="text-[#4d6072] text-[12px] font-semibold uppercase tracking-wider hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/[0.03]">
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-[#414848]">Date</th>
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-[#414848]">Detail</th>
                  <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-[#414848] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {entries?.map(entry => (
                  <tr key={entry.id} className="group">
                    <td className="py-4">
                      <button 
                        onClick={() => { onAction?.(); setSelectedRemark({ date: entry.date, remarks: entry.remarks }); }}
                        className="text-[#414848] text-sm hover:text-[#0d2c2e] hover:underline"
                      >
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1a1c1e]">{entry.remarks}</span>
                        <span className="text-[10px] text-[#8c8f8e] uppercase tracking-wider">{entry.category}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-semibold text-[#001618] text-[15px]">
                      -${entry.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {entries?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[#8c8f8e] text-sm">No expenses recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-black/[0.05] p-5 rounded-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#8c8f8e] block mb-1">Total Spent</span>
          <span className="text-[28px] font-bold text-[#001618]">${totalSpent.toFixed(2)}</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedRemark && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { onAction?.(); setSelectedRemark(null); }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#001618]">Expense Details</h3>
                <button onClick={() => { onAction?.(); setSelectedRemark(null); }} className="p-2 hover:bg-black/5 rounded-full text-[#414848]">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-[#414848] mb-2 font-medium">Date: {new Date(selectedRemark.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
              <div className="bg-[#f3f3f6] p-4 rounded-xl">
                <p className="text-[#1a1c1e] whitespace-pre-wrap">{selectedRemark.remarks}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
