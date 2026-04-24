'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, GripVertical, ChevronRight, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';

interface Tag {
  label: string;
  color: string;
}

interface TagDefinition {
  id: string;
  label: string;
  color: string;
}

interface RowData {
  id: string;
  task: string;
  priority: Tag[]; // Priority tags selected for this row
  details: string;
  isExpanded: boolean;
}

const TAG_COLORS = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'bg-zinc-800 text-zinc-300 border-zinc-700'
];

interface SpreadsheetProps {
  onAction?: () => void;
}

export default function Spreadsheet({ onAction }: SpreadsheetProps) {
  const [customTags, setCustomTags] = useState<TagDefinition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('utility-hub-sheet-tags');
      return saved ? JSON.parse(saved) : [
        { id: '1', label: 'High', color: TAG_COLORS[2] },
        { id: '2', label: 'Urgent', color: TAG_COLORS[3] }
      ];
    }
    return [];
  });

  const [rows, setRows] = useState<RowData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('utility-hub-sheet-rows-v2');
      return saved ? JSON.parse(saved) : [
        { id: '1', task: 'Design System', priority: [{ label: 'High', color: TAG_COLORS[2] }], details: 'Consistent spacing and colors.', isExpanded: false },
        { id: '2', task: 'Haptic Feedback', priority: [{ label: 'Urgent', color: TAG_COLORS[3] }], details: 'Use navigator.vibrate()', isExpanded: false }
      ];
    }
    return [];
  });

  const [activePicker, setActivePicker] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('utility-hub-sheet-rows-v2', JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem('utility-hub-sheet-tags', JSON.stringify(customTags));
  }, [customTags]);

  const addRow = () => {
    onAction?.();
    const newRow: RowData = {
      id: Date.now().toString(),
      task: '',
      priority: [],
      details: '',
      isExpanded: false
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    onAction?.();
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = useCallback((id: string, updates: Partial<RowData>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const toggleTag = (rowId: string, tag: TagDefinition) => {
    onAction?.();
    const row = rows.find(r => r.id === rowId);
    if (!row) return;

    const exists = row.priority.find(t => t.label === tag.label);
    if (exists) {
      updateRow(rowId, { priority: row.priority.filter(t => t.label !== tag.label) });
    } else {
      updateRow(rowId, { priority: [...row.priority, { label: tag.label, color: tag.color }] });
    }
  };

  const addCustomTag = (label: string, color: string) => {
    if (!label.trim()) return;
    const newTag: TagDefinition = {
      id: Date.now().toString(),
      label,
      color
    };
    setCustomTags([...customTags, newTag]);
    return newTag;
  };

  const onReorder = (newRows: RowData[]) => {
    setRows(newRows);
  };

  return (
    <div className="flex flex-col h-full bg-black select-none" onClick={() => setActivePicker(null)}>
      <div className="flex items-center justify-between px-6 pt-12 pb-6 shrink-0">
        <div>
          <span className="block text-[11px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
            Task Management
          </span>
          <h2 className="text-xl font-light text-white tracking-tight">Project Roadmap</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex border-b border-zinc-800 sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6">
          <div className="w-12 shrink-0" />
          <div className="w-10 shrink-0" />
          <div className="flex-[2] py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Task</div>
          <div className="flex-1 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-3">Priority</div>
          <div className="w-12 shrink-0" />
        </div>

        <Reorder.Group axis="y" values={rows} onReorder={onReorder} className="px-0">
          {rows.map((row) => (
            <RowItem 
              key={row.id} 
              row={row} 
              updateRow={updateRow} 
              removeRow={removeRow}
              activePicker={activePicker}
              setActivePicker={setActivePicker}
              toggleTag={toggleTag}
              customTags={customTags}
              addCustomTag={addCustomTag}
              onAction={onAction}
            />
          ))}
        </Reorder.Group>

        <div className="px-6">
          <button 
            onClick={addRow}
            className="flex items-center gap-2 py-6 text-zinc-500 hover:text-cyan-400 transition-colors w-full border-b border-zinc-900 group"
          >
            <div className="p-1 rounded bg-zinc-900 group-hover:bg-cyan-500/20 transition-colors">
              <Plus size={14} />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold">New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function RowItem({ row, updateRow, removeRow, activePicker, setActivePicker, toggleTag, customTags, addCustomTag, onAction }: { 
  row: RowData, 
  updateRow: (id: string, updates: Partial<RowData>) => void,
  removeRow: (id: string) => void,
  activePicker: string | null,
  setActivePicker: (id: string | null) => void,
  toggleTag: (id: string, tag: TagDefinition) => void,
  customTags: TagDefinition[],
  addCustomTag: (label: string, color: string) => TagDefinition | undefined,
  onAction?: () => void
}) {
  const dragControls = useDragControls();
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = addCustomTag(newTagLabel, selectedColor);
    if (tag) {
      toggleTag(row.id, tag);
      setNewTagLabel('');
    }
  };

  return (
    <Reorder.Item
      value={row}
      id={row.id}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => onAction?.()}
      className="flex flex-col border-b border-zinc-900 bg-black"
    >
      <div className="flex items-stretch min-h-[64px] transition-colors group">
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="w-10 shrink-0 flex items-center justify-center text-zinc-800 group-hover:text-zinc-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={14} />
        </div>

        <button 
          onClick={() => { onAction?.(); updateRow(row.id, { isExpanded: !row.isExpanded }); }}
          className="w-10 shrink-0 flex items-center justify-center text-zinc-600 hover:text-zinc-300"
        >
          {row.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className="flex-1 flex min-w-0">
          <div className="flex-[2] min-w-0 border-r border-zinc-900/50 flex items-center">
            <input
              type="text"
              value={row.task}
              onChange={(e) => updateRow(row.id, { task: e.target.value })}
              className="w-full bg-transparent px-3 py-4 text-sm text-zinc-200 focus:outline-none placeholder:text-zinc-800"
              placeholder="Task name"
            />
          </div>
          
          <div className="flex-1 min-w-0 flex items-center px-3 relative overflow-visible">
            <div className="flex flex-wrap gap-1.5 items-center w-full">
              {row.priority.map(tag => (
                <span 
                  key={tag.label} 
                  className={`text-[9px] px-2 py-0.5 rounded border font-bold whitespace-nowrap flex items-center gap-1.5 ${tag.color}`}
                >
                  {tag.label.toUpperCase()}
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    const tagDef = customTags.find(t => t.label === tag.label) || { id: 'temp', label: tag.label, color: tag.color };
                    toggleTag(row.id, tagDef); 
                  }} className="hover:text-white opacity-40 hover:opacity-100">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button 
                onClick={(e) => { e.stopPropagation(); setActivePicker(activePicker === row.id ? null : row.id); }}
                className="text-zinc-800 hover:text-zinc-500 transition-colors p-1"
              >
                <Plus size={14} />
              </button>
            </div>

            <AnimatePresence>
              {activePicker === row.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-3 z-50 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest px-1 mb-3 font-bold">Select or Create Tag</div>
                  
                  <div className="max-h-40 overflow-y-auto no-scrollbar mb-4 space-y-1">
                    {customTags.length === 0 && (
                      <div className="text-[10px] text-zinc-600 italic px-2 py-2">No tags created yet.</div>
                    )}
                    {customTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={(e) => { e.stopPropagation(); toggleTag(row.id, tag); }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between ${
                          row.priority.some(t => t.label === tag.label) 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <span>{tag.label}</span>
                        <div className={`w-2 h-2 rounded-full ${tag.color.split(' ')[0]}`} />
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <form onSubmit={handleAddTag} className="space-y-3">
                      <input 
                        type="text" 
                        value={newTagLabel}
                        onChange={(e) => setNewTagLabel(e.target.value)}
                        placeholder="Tag name..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`w-5 h-5 rounded-md border transition-all ${color.split(' ')[0]} ${
                              selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase tracking-widest font-bold py-2 rounded-lg transition-colors"
                      >
                        Create Tag
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={() => removeRow(row.id)}
          className="px-4 text-zinc-900 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <AnimatePresence>
        {row.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-950 border-t border-zinc-900"
          >
            <div className="px-20 py-8 border-l-2 border-cyan-500/20 ml-5 my-4">
              <span className="block text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-3">Description</span>
              <textarea
                value={row.details}
                onChange={(e) => updateRow(row.id, { details: e.target.value })}
                className="w-full bg-transparent text-sm text-zinc-400 focus:outline-none resize-none leading-relaxed"
                rows={5}
                placeholder="Write task specifications, links, or notes here..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

