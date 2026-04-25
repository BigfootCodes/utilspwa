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
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Tasks</h2>
      </div>

      <div className="bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border border-black/[0.05] dark:border-[#444747] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.05] dark:border-[#444747] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onAction?.()} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8] hover:text-[#001618] dark:hover:text-[#f0f0f3] transition-colors">
              <Filter size={18} /> Filter
            </button>
            <button onClick={() => onAction?.()} className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8] hover:text-[#001618] dark:hover:text-[#f0f0f3] transition-colors">
              <ArrowUpDown size={18} /> Sort
            </button>
          </div>
          <button
            onClick={addNewEntry}
            className="bg-[#001618] dark:bg-[#0d2c2e] text-white px-4 py-2 rounded-full text-[14px] font-semibold flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>

        <div className="divide-y divide-black/[0.05] dark:divide-[#444747]">
          {tasks?.map((task, idx) => (
            <div
              key={task.id}
              onClick={() => { onAction?.(); setSelectedTask(task); }}
              className="p-5 hover:bg-[#f3f3f6] dark:hover:bg-[#252828] transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx % 3 === 0 ? 'bg-[#cee2f6] dark:bg-[#364959] text-[#526576] dark:text-[#b5c9dd]' : idx % 3 === 1 ? 'bg-[#c9e8eb] dark:bg-[#0d2c2e] text-[#2e4c4e] dark:text-[#adccce]' : 'bg-[#e1e3e2] dark:bg-[#353738] text-[#444747] dark:text-[#c4c7c6]'}`}>
                    {idx % 3 === 0 ? <Database size={20} /> : idx % 3 === 1 ? <Zap size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#001618] dark:text-[#f0f0f3]">{task.task}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.priority.length > 0 ? (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${task.priority[0].color}`}>
                      {task.priority[0].label}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-[#e8e8ea] dark:bg-[#444747] text-[#414848] dark:text-[#c4c7c6]">
                      LOW
                    </span>
                  )}
                  <ChevronRight size={20} className="text-[#717879] group-hover:text-[#001618] dark:group-hover:text-[#f0f0f3] transition-colors" />
                </div>
              </div>
            </div>
          ))}
          {tasks?.length === 0 && (
            <div className="p-8 text-center text-[#414848] dark:text-[#8c8f8e] text-sm">No operational streams available. Create a new entry.</div>
          )}
        </div>

        <div className="px-6 py-4 bg-white dark:bg-[#1a1c1e] border-t border-black/[0.05] dark:border-[#444747] flex items-center justify-between">
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
              className="bg-white dark:bg-[#1a1c1e] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-black/[0.05] dark:border-[#444747] flex justify-between items-center bg-[#f9f9fc] dark:bg-[#252828]">
                <h3 className="text-lg font-bold text-[#001618] dark:text-[#f0f0f3]">Details</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteEntry(selectedTask.id)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-rose-500">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => { onAction?.(); setSelectedTask(null); setIsEditing(false); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[#414848] dark:text-[#8c8f8e]">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] dark:text-[#8c8f8e] block mb-2">Task Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedTask.task}
                      onChange={e => setSelectedTask({ ...selectedTask, task: e.target.value })}
                      className="w-full bg-[#f3f3f6] dark:bg-[#252828] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 outline-none text-[#1a1c1e] dark:text-[#f0f0f3] font-semibold"
                    />
                  ) : (
                    <div className="text-[17px] font-semibold text-[#001618] dark:text-[#f0f0f3]">{selectedTask.task}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] dark:text-[#8c8f8e] block mb-2">Priority</label>
                  <div className="flex gap-2">
                    {['LOW', 'MEDIUM', 'CRITICAL'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          if (isEditing) {
                            onAction?.();
                            const color = p === 'CRITICAL' ? 'bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#93000a]' : p === 'MEDIUM' ? 'bg-[#cee2f6] dark:bg-[#cee2f6]/20 text-[#526576]' : 'bg-[#e8e8ea] dark:bg-[#444747] text-[#414848] dark:text-[#c4c7c6]';
                            setSelectedTask({ ...selectedTask, priority: [{ label: p, color }] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider border ${selectedTask.priority[0]?.label === p ? 'border-black/[0.2] shadow-sm' : 'border-transparent'} ${p === 'CRITICAL' ? 'bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#93000a]' : p === 'MEDIUM' ? 'bg-[#cee2f6] dark:bg-[#cee2f6]/20 text-[#526576]' : 'bg-[#e8e8ea] dark:bg-[#444747] text-[#414848] dark:text-[#c4c7c6]'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] dark:text-[#8c8f8e] block mb-2">Additional Information</label>
                  {isEditing ? (
                    <textarea
                      value={selectedTask.details}
                      onChange={e => setSelectedTask({ ...selectedTask, details: e.target.value })}
                      rows={4}
                      placeholder="Add notes, specifications, or links..."
                      className="w-full bg-[#f3f3f6] dark:bg-[#252828] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 outline-none text-[#1a1c1e] dark:text-[#f0f0f3] text-[15px] resize-none"
                    />
                  ) : (
                    <div className="bg-[#f3f3f6] dark:bg-[#252828] p-4 rounded-xl min-h-[100px]">
                      <p className="text-[#1a1c1e] dark:text-[#f0f0f3] text-[15px] whitespace-pre-wrap">{selectedTask.details || 'No additional information provided.'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-black/[0.05] dark:border-[#444747] bg-[#f9f9fc] dark:bg-[#252828]">
                {isEditing ? (
                  <button
                    onClick={saveDetails}
                    className="w-full bg-[#001618] dark:bg-[#0d2c2e] text-white font-semibold text-[16px] py-3 rounded-xl active:scale-95 transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => { onAction?.(); setIsEditing(true); }}
                    className="w-full bg-white dark:bg-[#1a1c1e] border border-black/[0.1] dark:border-[#444747] text-[#001618] dark:text-[#f0f0f3] font-semibold text-[16px] py-3 rounded-xl active:scale-95 transition-all shadow-sm hover:bg-black/[0.02]"
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
