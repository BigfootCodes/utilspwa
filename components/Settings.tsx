'use client';

import { Trash2, Smartphone, BellOff, Info } from 'lucide-react';

interface SettingsProps {
  haptics: boolean;
  setHaptics: (val: boolean) => void;
}

export default function Settings({ haptics, setHaptics }: SettingsProps) {
  const clearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black px-6">
      <div className="pt-12 pb-8">
        <span className="block text-[11px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
          Preferences
        </span>
        <h2 className="text-xl font-light text-white tracking-tight">System Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 text-cyan-400">
              <Smartphone size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Haptic Feedback</p>
              <p className="text-[10px] text-zinc-500">Tactile vibration on tap</p>
            </div>
          </div>
          <button 
            onClick={() => setHaptics(!haptics)}
            className={`w-12 h-6 rounded-full relative transition-colors ${haptics ? 'bg-cyan-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${haptics ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <button 
            onClick={clearData}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-rose-500">
                <Trash2 size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Clear All Local Data</p>
                <p className="text-[10px] text-zinc-500">Wipe counter, timer, and rows</p>
              </div>
            </div>
            <div className="text-zinc-700 group-hover:text-zinc-500 transition-colors">
              <Info size={16} />
            </div>
          </button>
        </div>
      </div>

      <div className="mt-auto pb-24 text-center opacity-20">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Utility Duo v2.0</p>
        <p className="text-[8px] font-mono mt-1 uppercase tracking-[0.2em]">Build Core-04</p>
      </div>
    </div>
  );
}
