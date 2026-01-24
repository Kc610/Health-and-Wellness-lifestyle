
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sounds } from '../services/ui-sounds';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

const ProfileModal: React.FC<Props> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playInject();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface-dark border border-primary/30 p-10 shadow-[0_0_80px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-white">Bio-Baseline <span className="text-primary italic">Config</span></h2>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-2">Modifying biological hardware constants</p>
          </div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="text-neutral-600 hover:text-white transition-colors size-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Chronological Age</label>
              <input 
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-sm font-mono focus:border-primary outline-none transition-colors text-white"
                placeholder="25"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Body Mass (KG)</label>
              <input 
                type="number"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-sm font-mono focus:border-primary outline-none transition-colors text-white"
                placeholder="75"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Activity Level Protocol</label>
            <select 
              value={formData.activityLevel}
              onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-sm font-mono focus:border-primary outline-none transition-colors appearance-none text-white cursor-pointer"
            >
              <option value="low">LOW (Sedentary)</option>
              <option value="moderate">MODERATE (3-4 Days/Week)</option>
              <option value="high">HIGH (Daily Optimization)</option>
              <option value="elite">ELITE (Professional Athlete)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Optimization Goals</label>
            <textarea 
              value={formData.goals}
              onChange={e => setFormData({ ...formData, goals: e.target.value })}
              rows={3}
              className="w-full bg-neutral-900/50 border border-white/10 px-6 py-4 text-sm font-mono focus:border-primary outline-none transition-colors resize-none text-white"
              placeholder="e.g. Maximize cognitive output, hypertrophy, longevity..."
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-primary text-black py-6 font-black text-xs uppercase tracking-[0.5em] hover:bg-white transition-all active:scale-95 shadow-xl"
            >
              Commit to Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
