
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface-dark border border-primary/30 p-8 shadow-[0_0_50px_rgba(0,255,127,0.1)] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-white">Bio-Baseline <span className="text-primary italic">Config</span></h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Modifying biological hardware constants</p>
          </div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Chronological Age</label>
              <input 
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono focus:border-primary outline-none transition-colors"
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Body Mass (KG)</label>
              <input 
                type="number"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono focus:border-primary outline-none transition-colors"
                placeholder="75"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity Level Protocol</label>
            <select 
              value={formData.activityLevel}
              onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono focus:border-primary outline-none transition-colors appearance-none"
            >
              <option value="low">LOW (Sedentary)</option>
              <option value="moderate">MODERATE (3-4 Days/Week)</option>
              <option value="high">HIGH (Daily Optimization)</option>
              <option value="elite">ELITE (Professional Athlete)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Optimization Goals</label>
            <textarea 
              value={formData.goals}
              onChange={e => setFormData({ ...formData, goals: e.target.value })}
              rows={3}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono focus:border-primary outline-none transition-colors resize-none"
              placeholder="e.g. Maximize cognitive output, hypertrophy, longevity..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-primary text-black py-4 font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95"
            >
              Commit Data to Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
