
import React, { useState, useEffect } from 'react';
import { generateIntelLeaks } from '../services/gemini';

const IntelTicker: React.FC = () => {
  const [leaks, setLeaks] = useState<string[]>([]);

  useEffect(() => {
    const fetchLeaks = async () => {
      const data = await generateIntelLeaks();
      setLeaks(data);
    };
    fetchLeaks();
    const interval = setInterval(fetchLeaks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 z-[75] w-full bg-primary/10 border-b border-primary/20 h-8 flex items-center overflow-hidden backdrop-blur-md">
      <div className="flex items-center gap-4 px-4 bg-primary text-black font-black text-[9px] uppercase tracking-widest h-full shrink-0">
        <span className="material-symbols-outlined text-xs">rss_feed</span>
        Live Intel
      </div>
      <div className="marquee-content flex gap-12 animate-marquee">
        {[...leaks, ...leaks].map((leak, i) => (
          <span key={i} className="text-[10px] font-mono font-bold text-primary uppercase whitespace-nowrap">
            {leak} <span className="mx-4 text-primary/30">//</span>
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
