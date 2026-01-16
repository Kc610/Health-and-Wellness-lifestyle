
import React, { useState, useRef, useMemo } from 'react';
import { Product } from '../types';
import { generateProductIntel, speakProtocol, NeuralLinkError } from '../services/gemini';
import { sounds } from '../services/ui-sounds';

const PRODUCTS: Product[] = [
  {
    handle: "5-htp",
    title: "5-HTP Protocol",
    price: "19.90",
    sku: "VOX45HTP",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-0.jpg",
    category: "Amino Acids & Blends",
    description: "5-HTP occurs naturally in the body. Aids in supporting normal serotonin levels in the brain and emotional well-being."
  },
  {
    handle: "ashwagandha",
    title: "Ashwagandha Adaptogen",
    price: "23.90",
    sku: "VOX4ASHW",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025355-generated-label-image-0.jpg",
    category: "Natural Extracts",
    description: "Powerful adaptogen that helps individuals calm their stress levels. Contains potent chemicals that help to support overall health."
  },
  {
    handle: "alpha-energy",
    title: "Alpha Energy Spike",
    price: "40.90",
    sku: "VOX4TEST",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108339-generated-label-image-0.jpg",
    category: "Specialty Supplements",
    description: "Supports Men's Vitality and Wellness. Formulated with magnesium, zinc, tribulus terrestris, and more."
  },
  {
    handle: "chaga-mushroom",
    title: "Chaga Intel Node",
    price: "29.90",
    sku: "RLC3CHAG",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044056015-generated-label-image-0.jpg",
    category: "Natural Extracts",
    description: "Loaded with essential phytochemicals that stimulate the immunological and hormonal systems."
  },
  {
    handle: "creatine-monohydrate",
    title: "Creatine Monohydrate",
    price: "33.90",
    sku: "RLC4CREA",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044066488-generated-label-image-0.jpg",
    category: "Amino Acids & Blends",
    description: "Crucial role in energy production within your muscles. bridging the gap for muscle protein synthesis."
  },
  {
    handle: "hydration-powder-lemonade",
    title: "Hydration (Lemonade)",
    price: "34.99",
    sku: "OSM0LEMO",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044367310-generated-label-image-0.jpg",
    category: "Specialty Supplements",
    description: "Refreshing drink that blends essential electrolytes to keep you revitalized and energized."
  },
  {
    handle: "keto-5",
    title: "Keto-5 Fuel",
    price: "32.90",
    sku: "VOX4KETO",
    image: "https://cdn.shopify.com/s/files/1/0595/1012/6126/files/1758059510126-generated-label-image-0.jpg",
    category: "Specialty Supplements",
    description: "Helps the body burn fat effectively by entering the body into the ketosis metabolic state."
  },
  {
    handle: "ultra-cleanse-greens",
    title: "Smoothie Greens",
    price: "42.90",
    sku: "RLC5GRNS",
    image: "https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044074464-generated-label-image-0.jpg",
    category: "Natural Extracts",
    description: "Blend of organic grasses, superfoods, and botanical extracts for optimal mental and physical functionality."
  }
];

const ProtocolStore: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [intelReport, setIntelReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return PRODUCTS;
    return PRODUCTS.filter(product => 
      product.title.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleDecompile = async (product: Product) => {
    sounds.playInject();
    setSelectedProduct(product);
    setIsGenerating(true);
    setIntelReport(null);
    setError(null);
    try {
      const report = await generateProductIntel(product.title, product.description);
      setIntelReport(report);
    } catch (e) {
      setError(e instanceof NeuralLinkError ? e.message : "LINK INTERRUPTED");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = async () => {
    if (!intelReport || isSpeaking) return;
    sounds.playBlip();
    setIsSpeaking(true);
    setError(null);
    try {
      const playback = await speakProtocol(intelReport);
      if (playback) {
        currentAudioSource.current = playback.source;
        playback.source.start(0);
        playback.source.onended = () => {
          setIsSpeaking(false);
          currentAudioSource.current = null;
        };
      }
    } catch (e) {
      setError(e instanceof NeuralLinkError ? e.message : "VOICE CORE FAIL");
      setIsSpeaking(false);
    }
  };

  const closeModal = () => {
    sounds.playClick();
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
    }
    setSelectedProduct(null);
    setIntelReport(null);
    setError(null);
    setIsSpeaking(false);
  };

  return (
    <section id="protocols" className="py-32 bg-black relative">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <p className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-xs">Proprietary Stacks</p>
            <h2 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tighter">Inventory <span className="text-primary italic">Access</span></h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative group">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="QUERY INVENTORY..."
                  className="bg-surface-dark border border-white/10 px-6 py-4 pl-12 text-[10px] font-mono tracking-widest uppercase focus:border-primary outline-none transition-all w-full sm:min-w-[300px] text-white"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-primary transition-colors">search</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
             </div>
             <div className="flex items-center gap-2 px-6 py-4 border border-white/10 bg-white/5 h-[54px]">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Node Sync Active</span>
             </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in">
            {filteredProducts.map((product) => (
              <div key={product.handle} className="group relative bg-surface-dark border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/5] overflow-hidden bg-black/40 relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                  />
                  <div className="absolute top-4 left-4">
                    <p className="text-[9px] font-black uppercase tracking-wider bg-black/80 px-2 py-1 border border-white/10 text-slate-400">
                      {product.sku}
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[9px] text-primary font-bold uppercase tracking-[0.3em] mb-3">{product.category}</p>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-6 group-hover:text-primary transition-colors">{product.title}</h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xl font-bold">${product.price}</p>
                    <button 
                      onClick={() => handleDecompile(product)}
                      className="text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 px-4 py-2 hover:bg-primary hover:text-black hover:border-primary transition-all"
                    >
                      Intel Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-dashed border-white/10 bg-white/5 animate-pulse">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">inventory_2</span>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-500">No matching protocols found in current node sector.</p>
          </div>
        )}
      </div>

      {/* Intel Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={closeModal}></div>
          <div className="relative w-full max-w-4xl bg-surface-dark border border-primary/30 p-8 md:p-16 shadow-[0_0_150px_rgba(0,255,127,0.15)] overflow-y-auto max-h-[95vh]">
            <div className="absolute top-4 right-4">
               <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors size-12 flex items-center justify-center">
                 <span className="material-symbols-outlined text-4xl">close</span>
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <div className="aspect-square bg-black border border-white/10 mb-8 overflow-hidden">
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => sounds.playClick()}
                    className="w-full bg-primary text-black py-5 font-black text-xs uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-xl"
                  >
                    Authorize Protocol Acquisition
                  </button>
                  <button 
                    onClick={handleSpeak}
                    disabled={!intelReport || isSpeaking}
                    className={`w-full border py-4 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-30 group ${error ? 'bg-safety-orange/10 border-safety-orange/30 text-safety-orange hover:bg-safety-orange hover:text-black' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    <span className={`material-symbols-outlined text-lg ${isSpeaking ? 'animate-pulse text-primary' : ''}`}>
                      {isSpeaking ? 'audio_file' : error ? 'error' : 'volume_up'}
                    </span>
                    {isSpeaking ? 'SYNTESIZING...' : error ? 'RETRY SYNTH' : 'SYNTHESIZE VOICE INTEL'}
                  </button>
                </div>
              </div>
              
              <div className="lg:col-span-8">
                <div className="mb-10">
                  <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary mb-2">{selectedProduct.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Node: {selectedProduct.sku}</span>
                    <span className="size-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Auth Required</span>
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h4 className={`font-mono text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-3 transition-colors ${error ? 'text-safety-orange' : 'text-primary/60'}`}>
                      <span className={`h-px w-8 ${error ? 'bg-safety-orange/40' : 'bg-primary/20'}`}></span> {error ? 'Neural Link Error' : 'Biological Intel Report'}
                    </h4>
                    <div className="font-mono text-sm leading-relaxed text-slate-300 min-h-[300px]">
                      {isGenerating ? (
                        <div className="flex flex-col gap-6">
                          <div className="h-4 bg-white/5 w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-white/5 w-full animate-pulse [animation-delay:0.1s]"></div>
                          <div className="h-4 bg-white/5 w-1/2 animate-pulse [animation-delay:0.2s]"></div>
                        </div>
                      ) : error ? (
                        <div className="p-8 border border-safety-orange/20 bg-safety-orange/5 text-safety-orange animate-glitch-subtle">
                           <p className="mb-6 font-bold uppercase tracking-widest">{error}</p>
                           <button 
                             onClick={() => handleDecompile(selectedProduct)}
                             className="text-[10px] font-black border border-safety-orange px-6 py-2 hover:bg-safety-orange hover:text-black transition-all"
                           >
                             Re-run Decryption
                           </button>
                        </div>
                      ) : (
                        <div className={`whitespace-pre-wrap animate-fade-in border-l-2 pl-8 transition-all duration-1000 ${isSpeaking ? 'border-primary shadow-[inset_10px_0_20px_-10px_rgba(0,255,127,0.1)]' : 'border-primary/20'}`}>
                          {intelReport}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProtocolStore;
