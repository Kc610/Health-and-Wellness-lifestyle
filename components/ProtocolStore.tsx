
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../services/products';
import { sounds } from '../services/ui-sounds';

const ProtocolStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return PRODUCTS;
    return PRODUCTS.filter(product => 
      product.title.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleProductClick = (handle: string) => {
    sounds.playClick();
    navigate(`/protocol/${handle}`);
  };

  return (
    <section id="protocols" className="py-40 bg-background-dark relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20"></div>
      
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="reveal-on-scroll">
            <p className="text-primary font-bold tracking-[0.4em] uppercase mb-6 text-xs flex items-center gap-4">
              <span className="w-6 h-[1px] bg-primary"></span>
              Proprietary Bio-Strands
            </p>
            <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white text-glow">
              Protocol <span className="text-primary italic">Helix</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
             <div className="relative group">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH VITALITY SECTOR..."
                  className="bg-surface-dark border border-white/10 px-8 py-6 pl-16 text-[11px] font-mono tracking-[0.3em] uppercase focus:border-primary outline-none transition-all w-full sm:min-w-[420px] text-white focus:shadow-[0_0_30px_rgba(0,255,127,0.15)] placeholder:text-zinc-700"
                />
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 text-2xl group-focus-within:text-primary transition-colors">dna</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                )}
             </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.handle} 
                onClick={() => handleProductClick(product.handle)}
                className="group cursor-pointer relative bg-surface-dark border border-white/5 hover:border-primary/40 transition-all duration-700 hover:-translate-y-4 shadow-3xl overflow-hidden"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="aspect-[4/5] overflow-hidden bg-black relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest bg-background-dark/90 px-4 py-2 border border-white/10 text-primary backdrop-blur-lg">
                      {product.sku}
                    </p>
                  </div>

                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none"></div>
                </div>

                <div className="p-10 relative bg-surface-dark/95 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] group-hover:text-zinc-300 transition-colors">{product.category}</p>
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-10 group-hover:text-primary transition-colors min-h-[72px] leading-none text-white">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-8">
                    <p className="font-mono text-3xl font-black text-white">${product.price}</p>
                    <div className="group/btn relative px-8 py-4 overflow-hidden border border-primary/30">
                      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] group-hover/btn:text-black transition-colors text-white">Open Matrix</span>
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-48 text-center border border-dashed border-white/10 bg-white/[0.02] animate-pulse rounded-2xl">
            <span className="material-symbols-outlined text-8xl text-zinc-800 mb-10">satellite_alt</span>
            <h4 className="font-display text-3xl font-bold uppercase text-white mb-4">Sector Unresponsive</h4>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-600">Search query returned zero vitality hits in the protocol helix.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProtocolStore;
