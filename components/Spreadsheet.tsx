'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Filter, ArrowUpDown, Plus, Calendar, User, ChevronRight, X, Trash2, Database, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Spreadsheet({ onAction }: { onAction?: () => void }) {
  const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), []);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addNewEntry = async () => {
    onAction?.();
    const count = await db.tasks.count();
    await db.tasks.add({
      id: crypto.randomUUID(),
      task: 'New Task',
      priority: [{ label: 'LOW', color: 'bg-[#e8e8ea] text-[#414848]' }],
      details: '',
      isExpanded: false,
      order: count
    });
  };

  const deleteEntry = async (id: string) => {
    onAction?.();
    await db.tasks.delete(id);
    setSelectedTask(null);
  };

  const saveDetails = async () => {
    if (!selectedTask) return;
    onAction?.();
    await db.tasks.update(selectedTask.id, {
      task: selectedTask.task,
      details: selectedTask.details
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-32 px-6 pt-8 max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618]">Tasks</h2>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onAction?.()} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] hover:text-[#001618] transition-colors">
              <Filter size={18} /> Filter
            </button>
            <button onClick={() => onAction?.()} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] hover:text-[#001618] transition-colors">
              <ArrowUpDown size={18} /> Sort
            </button>
          </div>
          <button
            onClick={addNewEntry}
            className="bg-[#001618] text-white px-4 py-2 rounded-full text-[14px] font-semibold flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>

        <div className="divide-y divide-black/[0.05]">
          {tasks?.map((task, idx) => (
            <div
              key={task.id}
              onClick={() => { onAction?.(); setSelectedTask(task); }}
              className="p-5 hover:bg-[#f3f3f6] transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx % 3 === 0 ? 'bg-[#cee2f6] text-[#526576]' : idx % 3 === 1 ? 'bg-[#c9e8eb] text-[#2e4c4e]' : 'bg-[#e1e3e2] text-[#444747]'}`}>
                    {idx % 3 === 0 ? <Database size={20} /> : idx % 3 === 1 ? <Zap size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#001618]">{task.task}</h3>
                    <p className="text-[13px] text-[#414848] mt-0.5">Stream: {idx % 3 === 0 ? 'Logistics' : idx % 3 === 1 ? 'CloudOps' : 'Security'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.priority.length > 0 ? (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${task.priority[0].color}`}>
                      {task.priority[0].label}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-[#e8e8ea] text-[#414848]">
                      LOW
                    </span>
                  )}
                  <ChevronRight size={20} className="text-[#717879] group-hover:text-[#001618] transition-colors" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-6 pl-14">
                <div className="flex items-center gap-1.5 text-[#8c8f8e]">
                  <Calendar size={16} />
                  <span className="text-[12px] font-medium">Oct 24</span>
                </div>
              </div>
            </div>
          ))}
          {tasks?.length === 0 && (
            <div className="p-8 text-center text-[#414848] text-sm">No operational streams available. Create a new entry.</div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-black/[0.05] flex items-center justify-between">
          <span className="text-[12px] text-[#8c8f8e] font-medium">Showing {tasks?.length || 0} records</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { onAction?.(); setSelectedTask(null); setIsEditing(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-black/[0.05] flex justify-between items-center bg-[#f9f9fc]">
                <h3 className="text-lg font-bold text-[#001618]">Stream Details</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteEntry(selectedTask.id)} className="p-2 hover:bg-black/5 rounded-full text-rose-500">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => { onAction?.(); setSelectedTask(null); setIsEditing(false); }} className="p-2 hover:bg-black/5 rounded-full text-[#414848]">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] block mb-2">Task Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedTask.task}
                      onChange={e => setSelectedTask({ ...selectedTask, task: e.target.value })}
                      className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 outline-none text-[#1a1c1e] font-semibold"
                    />
                  ) : (
                    <div className="text-[17px] font-semibold text-[#001618]">{selectedTask.task}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] block mb-2">Priority</label>
                  <div className="flex gap-2">
                    {['LOW', 'MEDIUM', 'CRITICAL'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          if (isEditing) {
                            onAction?.();
                            const color = p === 'CRITICAL' ? 'bg-[#ffdad6] text-[#93000a]' : p === 'MEDIUM' ? 'bg-[#cee2f6] text-[#526576]' : 'bg-[#e8e8ea] text-[#414848]';
                            setSelectedTask({ ...selectedTask, priority: [{ label: p, color }] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider border ${selectedTask.priority[0]?.label === p ? 'border-black/[0.2] shadow-sm' : 'border-transparent'} ${p === 'CRITICAL' ? 'bg-[#ffdad6] text-[#93000a]' : p === 'MEDIUM' ? 'bg-[#cee2f6] text-[#526576]' : 'bg-[#e8e8ea] text-[#414848]'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] block mb-2">Additional Information</label>
                  {isEditing ? (
                    <textarea
                      value={selectedTask.details}
                      onChange={e => setSelectedTask({ ...selectedTask, details: e.target.value })}
                      rows={4}
                      placeholder="Add notes, specifications, or links..."
                      className="w-full bg-[#f3f3f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 outline-none text-[#1a1c1e] text-[15px] resize-none"
                    />
                  ) : (
                    <div className="bg-[#f3f3f6] p-4 rounded-xl min-h-[100px]">
                      <p className="text-[#1a1c1e] text-[15px] whitespace-pre-wrap">{selectedTask.details || 'No additional information provided.'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-black/[0.05] bg-[#f9f9fc]">
                {isEditing ? (
                  <button
                    onClick={saveDetails}
                    className="w-full bg-[#001618] text-white font-semibold text-[16px] py-3 rounded-xl active:scale-95 transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => { onAction?.(); setIsEditing(true); }}
                    className="w-full bg-white border border-black/[0.1] text-[#001618] font-semibold text-[16px] py-3 rounded-xl active:scale-95 transition-all shadow-sm hover:bg-black/[0.02]"
                  >
                    Edit Details
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
