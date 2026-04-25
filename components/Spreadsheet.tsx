'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, CustomTag } from '../lib/db';
import { Plus, ChevronRight, X, Trash2, Database, Shield, Zap, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PASTEL_COLORS = [
  { bg: 'bg-[#e8e8ea] dark:bg-[#444747]', text: 'text-[#414848] dark:text-[#c4c7c6]', name: 'Gray' },
  { bg: 'bg-[#ffdad6] dark:bg-[#ffdad6]/20', text: 'text-[#93000a] dark:text-[#ffdad6]', name: 'Red' },
  { bg: 'bg-[#cee2f6] dark:bg-[#cee2f6]/20', text: 'text-[#526576] dark:text-[#cee2f6]', name: 'Blue' },
  { bg: 'bg-[#fef3c7] dark:bg-[#fef3c7]/20', text: 'text-[#92400e] dark:text-[#fef3c7]', name: 'Yellow' },
  { bg: 'bg-[#dcfce7] dark:bg-[#dcfce7]/20', text: 'text-[#166534] dark:text-[#dcfce7]', name: 'Green' },
  { bg: 'bg-[#e0e7ff] dark:bg-[#e0e7ff]/20', text: 'text-[#3730a3] dark:text-[#e0e7ff]', name: 'Indigo' },
  { bg: 'bg-[#fce7f3] dark:bg-[#fce7f3]/20', text: 'text-[#9d174d] dark:text-[#fce7f3]', name: 'Pink' },
];

export default function Spreadsheet({ onAction }: { onAction?: () => void }) {
  const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), []);
  const customTags = useLiveQuery(() => db.customTags.toArray(), []) || [];

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tag creation state
  const [showTagCreator, setShowTagCreator] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState(PASTEL_COLORS[0]);

  const filteredTasks = tasks?.filter(t => {
    if (!searchQuery) return true;
    try {
      const regex = new RegExp(searchQuery, 'i');
      return regex.test(t.task) || regex.test(t.details) || (t.tags && t.tags.some((tag: any) => regex.test(tag.label)));
    } catch (e) {
      return t.task.toLowerCase().includes(searchQuery.toLowerCase());
    }
  }) || [];

  const addNewEntry = async () => {
    onAction?.();
    const count = await db.tasks.count();
    await db.tasks.add({
      id: crypto.randomUUID(),
      task: 'New Entry',
      tags: [],
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
      details: selectedTask.details,
      tags: selectedTask.tags
    });
    setIsEditing(false);
  };

  const createTag = async () => {
    if (!newTagLabel.trim()) return;
    onAction?.();
    const newTag: CustomTag = {
      id: crypto.randomUUID(),
      label: newTagLabel.trim(),
      color: `${newTagColor.bg} ${newTagColor.text}`
    };
    await db.customTags.add(newTag);
    setNewTagLabel('');
    setShowTagCreator(false);
  };

  const deleteTag = async (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.();
    await db.customTags.delete(tagId);
  };

  const toggleTaskTag = (tag: CustomTag) => {
    if (!isEditing) return;
    onAction?.();
    const currentTags = selectedTask.tags || [];
    const hasTag = currentTags.some((t: any) => t.id === tag.id);
    if (hasTag) {
      setSelectedTask({ ...selectedTask, tags: currentTags.filter((t: any) => t.id !== tag.id) });
    } else {
      setSelectedTask({ ...selectedTask, tags: [...currentTags, tag] });
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32 px-6 pt-8 max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-[34px] font-bold tracking-tight text-[#001618] dark:text-[#f0f0f3]">Tasks</h2>
      </div>

      <div className="bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border border-black/[0.05] dark:border-[#444747] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-black/[0.05] dark:border-[#444747]">
          <Search size={20} className="text-[#8c8f8e]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#1a1c1e] dark:text-[#f0f0f3] placeholder:text-[#8c8f8e] text-[15px]"
          />
        </div>
      </div>

      <div className="bg-white/70 dark:bg-[#1a1c1e]/70 backdrop-blur-xl border border-black/[0.05] dark:border-[#444747] shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-black/[0.05] dark:border-[#444747] flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#4d6072] dark:text-[#8c9ba8]">Items</span>
          <button
            onClick={addNewEntry}
            className="bg-[#001618] dark:bg-[#0d2c2e] text-white px-3 py-1.5 rounded-md text-[13px] font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Plus size={16} /> New
          </button>
        </div>

        <div className="flex flex-col text-[14px]">
          <div className="flex border-b border-black/[0.05] dark:border-[#444747] bg-[#f9f9fc] dark:bg-[#252828]/50 text-[12px] text-[#8c8f8e]">
            <div className="flex-1 px-4 py-2 border-r border-black/[0.05] dark:border-[#444747]">Name</div>
            <div className="w-[140px] shrink-0 px-4 py-2">Tags</div>
          </div>
          
          <div className="flex flex-col">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => { onAction?.(); setSelectedTask(task); setIsEditing(false); }}
                className="flex border-b border-black/[0.05] dark:border-[#444747] last:border-0 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group cursor-pointer"
              >
                <div className="flex-1 px-4 py-2 border-r border-black/[0.05] dark:border-[#444747] flex items-center justify-between min-w-0">
                  <span className="font-medium text-[#1a1c1e] dark:text-[#f0f0f3] truncate mr-2">{task.task}</span>
                  <button className="shrink-0 px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#414848] dark:text-[#c4c7c6] text-[10px] uppercase font-bold tracking-wider rounded shadow-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-1">
                    Open
                  </button>
                </div>
                <div className="w-[140px] shrink-0 px-4 py-2 flex flex-wrap gap-1 items-center">
                  {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag: any) => (
                      <span key={tag.id} className={`px-1.5 py-0.5 rounded-[4px] text-[11px] whitespace-nowrap ${tag.color}`}>
                        {tag.label}
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-8 text-center text-[#414848] dark:text-[#8c8f8e] text-sm border-b border-black/[0.05] dark:border-[#444747]">No operational streams available.</div>
            )}
          </div>
        </div>

        <div className="px-4 py-3 bg-white dark:bg-[#1a1c1e] flex items-center justify-between">
          <span className="text-[12px] text-[#8c8f8e] font-medium">Showing {filteredTasks.length} records</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { onAction?.(); setSelectedTask(null); setIsEditing(false); setShowTagCreator(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1c1e] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-black/[0.05] dark:border-[#444747] flex justify-between items-center bg-[#f9f9fc] dark:bg-[#252828] shrink-0">
                <h3 className="text-lg font-bold text-[#001618] dark:text-[#f0f0f3]">Details</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteEntry(selectedTask.id)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-rose-500">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => { onAction?.(); setSelectedTask(null); setIsEditing(false); setShowTagCreator(false); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[#414848] dark:text-[#8c8f8e]">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] dark:text-[#8c8f8e] block mb-2">Task Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedTask.task}
                      onChange={e => setSelectedTask({ ...selectedTask, task: e.target.value })}
                      className="w-full bg-[#f3f3f6] dark:bg-[#252828] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4d6072]/20 outline-none text-[#1a1c1e] dark:text-[#f0f0f3] font-semibold"
                    />
                  ) : (
                    <div className="text-[20px] font-semibold text-[#001618] dark:text-[#f0f0f3]">{selectedTask.task}</div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#414848] dark:text-[#8c8f8e] block mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(selectedTask.tags || []).map((tag: any) => (
                      <span key={tag.id} className={`px-2.5 py-1 rounded-md text-[12px] font-semibold tracking-wide flex items-center gap-1.5 ${tag.color}`}>
                        {tag.label}
                        {isEditing && (
                          <button onClick={(e) => { e.stopPropagation(); toggleTaskTag(tag); }} className="hover:opacity-70">
                            <X size={12} />
                          </button>
                        )}
                      </span>
                    ))}
                    {(selectedTask.tags || []).length === 0 && !isEditing && (
                      <span className="text-sm text-[#8c8f8e]">No tags added.</span>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-black/[0.05] dark:border-[#444747]">
                      <h4 className="text-[11px] font-semibold uppercase text-[#8c8f8e] mb-2">Available Tags</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {customTags.map((tag) => {
                          const isAssigned = (selectedTask.tags || []).some((t: any) => t.id === tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => toggleTaskTag(tag)}
                              className={`px-2.5 py-1 rounded-md text-[12px] font-semibold tracking-wide flex items-center gap-1.5 transition-opacity ${tag.color} ${isAssigned ? 'opacity-50 ring-2 ring-offset-1 ring-black/20 dark:ring-white/20' : 'hover:opacity-80'}`}
                            >
                              {tag.label}
                              {!isAssigned && (
                                <span
                                  onClick={(e) => deleteTag(tag.id, e)}
                                  className="ml-1 opacity-50 hover:opacity-100 hover:text-rose-500"
                                >
                                  <Trash2 size={12} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showTagCreator ? (
                        <div className="bg-[#f3f3f6] dark:bg-[#252828] p-3 rounded-xl border border-black/[0.05] dark:border-[#444747]">
                          <input
                            type="text"
                            placeholder="Tag Name"
                            value={newTagLabel}
                            onChange={e => setNewTagLabel(e.target.value)}
                            className="w-full bg-white dark:bg-[#1a1c1e] border-none rounded-lg px-3 py-2 text-[14px] outline-none text-[#1a1c1e] dark:text-[#f0f0f3] mb-3"
                            autoFocus
                          />
                          <div className="flex flex-wrap gap-2 mb-3">
                            {PASTEL_COLORS.map(color => (
                              <button
                                key={color.name}
                                onClick={() => setNewTagColor(color)}
                                className={`w-6 h-6 rounded-full border-2 ${newTagColor.name === color.name ? 'border-[#001618] dark:border-[#f0f0f3] scale-110' : 'border-transparent'} ${color.bg}`}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={createTag} disabled={!newTagLabel.trim()} className="flex-1 bg-[#001618] dark:bg-[#0d2c2e] text-white py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50">Create</button>
                            <button onClick={() => setShowTagCreator(false)} className="flex-1 bg-white dark:bg-[#1a1c1e] text-[#001618] dark:text-[#f0f0f3] py-1.5 rounded-lg text-xs font-semibold border border-black/10 dark:border-white/10">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowTagCreator(true)} className="text-[12px] font-semibold text-[#4d6072] dark:text-[#8c9ba8] flex items-center gap-1 hover:text-[#001618] dark:hover:text-[#f0f0f3] transition-colors">
                          <Plus size={14} /> Create New Tag
                        </button>
                      )}
                    </div>
                  )}
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

              <div className="p-4 border-t border-black/[0.05] dark:border-[#444747] bg-[#f9f9fc] dark:bg-[#252828] shrink-0">
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
