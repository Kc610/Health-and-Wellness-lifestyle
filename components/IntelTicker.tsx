
import React, { useState, useEffect } from 'react';
import { generateIntelLeaks } from '../services/gemini';

const IntelTicker: React.FC = () => {
  const [leaks, setLeaks] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isStale, setIsStale] = useState(false);

  const fetchLeaks = async () => {
    setIsSyncing(true);
    try {
      const data = await generateIntelLeaks();
      setLeaks(data);
      setIsStale(data.some(l => l.includes('BUFFERING')));
    } catch (e) {
      setIsStale(true);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLeaks();
    const interval = setInterval(fetchLeaks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed top-20 z-[75] w-full border-b h-8 flex items-center overflow-hidden backdrop-blur-md transition-colors duration-500 ${isStale ? 'bg-safety-orange/5 border-safety-orange/20' : 'bg-primary/10 border-primary/20'}`}>
      <div className={`flex items-center gap-4 px-4 font-black text-[9px] uppercase tracking-widest h-full shrink-0 transition-colors ${isStale ? 'bg-safety-orange text-black' : 'bg-primary text-black'}`}>
        <span className={`material-symbols-outlined text-xs ${isSyncing ? 'animate-spin' : ''}`}>
          {isStale ? 'report_problem' : 'rss_feed'}
        </span>
        {isStale ? 'Emergency Cache' : 'Live Intel'}
      </div>
      <div className="marquee-content flex gap-12 animate-marquee">
        {(leaks.length > 0 ? leaks : ["INITIALIZING LINK...", "DECRYPTING NODE...", "SYNCING..."]).concat(leaks).map((leak, i) => (
          <span key={i} className={`text-[10px] font-mono font-bold uppercase whitespace-nowrap transition-colors ${isStale ? 'text-safety-orange/80' : 'text-primary'}`}>
            {leak} <span className={`mx-4 ${isStale ? 'text-safety-orange/20' : 'text-primary/30'}`}>//</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default IntelTicker;
