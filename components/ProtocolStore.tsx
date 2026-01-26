
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../services/products';
import { sounds } from '../services/ui-sounds';
import { generateProductVideo, NeuralLinkError, speakProtocol } from '../services/gemini';

const CATEGORIES = [
  "ALL SECTORS",
  "Amino Acids & Blends",
  "Proteins & Blends",
  "Specialty Supplements",
  "Natural Extracts"
];

const ProtocolStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("ALL SECTORS");

  // Video/Voice State Management
  const [videoPreviews, setVideoPreviews] = useState<Record<string, string>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const [loadingVoice, setLoadingVoice] = useState<Record<string, boolean>>({});
  const [videoStatus, setVideoStatus] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pausedVideos, setPausedVideos] = useState<Record<string, boolean>>({});
  
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "ALL SECTORS" || 
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleProductClick = (handle: string) => {
    sounds.playClick();
    navigate(`/protocol/${handle}`);
  };

  const handleSpeakProtocol = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (loadingVoice[product.handle]) return;

    sounds.playBlip();
    setLoadingVoice(prev => ({ ...prev, [product.handle]: true }));
    try {
      const audio = await speakProtocol(`Analyzing ${product.title}. ${product.description}`);
      if (audio) {
        audio.source.start(0);
        audio.source.onended = () => setLoadingVoice(prev => ({ ...prev, [product.handle]: false }));
      }
    } catch (err) {
      setLoadingVoice(prev => ({ ...prev, [product.handle]: false }));
    }
  };

  const handleGenerateVideo = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (loadingVideos[product.handle]) return;

    sounds.playInject();
    setLoadingVideos(prev => ({ ...prev, [product.handle]: true }));
    setErrors(prev => ({ ...prev, [product.handle]: '' }));
    
    try {
      const url = await generateProductVideo(product.title, (status) => {
        setVideoStatus(prev => ({ ...prev, [product.handle]: status }));
      });
      setVideoPreviews(prev => ({ ...prev, [product.handle]: url }));
      setPausedVideos(prev => ({ ...prev, [product.handle]: false }));
      sounds.playBlip();
    } catch (err) {
      const msg = err instanceof NeuralLinkError ? err.message : "Video node offline";
      setErrors(prev => ({ ...prev, [product.handle]: msg }));
    } finally {
      setLoadingVideos(prev => ({ ...prev, [product.handle]: false }));
    }
  };

  const togglePlayback = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    const video = videoRefs.current[handle];
    if (video) {
      if (video.paused) {
        video.play();
        setPausedVideos(prev => ({ ...prev, [handle]: false }));
      } else {
        video.pause();
        setPausedVideos(prev => ({ ...prev, [handle]: true }));
      }
      sounds.playBlip();
    }
  };

  return (
    <section id="protocols" className="py-40 bg-background-dark relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-24 gap-12">
          <div className="reveal-on-scroll">
            <p className="text-primary font-black tracking-[0.5em] uppercase mb-6 text-[10px] flex items-center gap-4">
              <span className="w-8 h-[1px] bg-primary"></span>
              Proprietary Bio-Strands
            </p>
            <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white text-glow">
              Protocol <span className="text-primary italic">Helix</span>
            </h2>
          </div>

          <div className="w-full xl:w-auto space-y-8">
            <div className="flex flex-wrap gap-4 border-b border-white/5 pb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { sounds.playBlip(); setSelectedCategory(cat); }}
                  className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all relative group ${
                    selectedCategory === cat 
                    ? 'text-primary' 
                    : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <span className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_#00FF7F]"></span>
                  )}
                  <span className="absolute -top-1 -right-1 size-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </button>
              ))}
            </div>

            <div className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH VITALITY SECTOR..."
                className="bg-neutral-900/30 border border-white/10 px-8 py-6 pl-16 text-[11px] font-mono tracking-[0.3em] uppercase focus:border-primary outline-none transition-all w-full lg:min-w-[500px] text-white focus:shadow-[0_0_40px_rgba(0,255,127,0.1)] placeholder:text-neutral-800"
              />
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700 text-2xl group-focus-within:text-primary transition-colors">dna</span>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.handle} 
                onClick={() => handleProductClick(product.handle)}
                className="group cursor-pointer relative bg-neutral-900/20 border border-white/5 hover:border-primary/40 transition-all duration-700 hover:-translate-y-4 shadow-3xl overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="aspect-[4/5] overflow-hidden bg-black relative">
                  {videoPreviews[product.handle] ? (
                    <div className="w-full h-full relative">
                      {/* Fix: Ensure ref callback returns void and handles null */}
                      <video 
                        ref={el => { videoRefs.current[product.handle] = el; }}
                        src={videoPreviews[product.handle]} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      {/* Play/Pause Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => togglePlayback(e, product.handle)}
                           className="size-20 bg-black/40 backdrop-blur-md rounded-full border border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all transform hover:scale-110 active:scale-95"
                         >
                           <span className="material-symbols-outlined text-4xl">
                             {pausedVideos[product.handle] ? 'play_arrow' : 'pause'}
                           </span>
                         </button>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] grayscale group-hover:grayscale-0" 
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
                  
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    {/* Fix: Use videoPreviews[product.handle] instead of the undeclared videoUrl */}
                    <p className="text-[9px] font-black uppercase tracking-widest bg-black/90 px-4 py-2 border border-white/10 text-primary backdrop-blur-md">
                      {product.sku} // {videoPreviews[product.handle] ? 'KINETIC FEED' : 'COREID'}
                    </p>
                    {videoPreviews[product.handle] && (
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-primary bg-primary/10 border border-primary/20 px-2 py-1 w-fit backdrop-blur-md animate-pulse">
                        {pausedVideos[product.handle] ? 'Paused' : 'Kinetic Feed'}
                      </span>
                    )}
                  </div>

                  {/* Top Right Toolbelt */}
                  <div className="absolute top-6 right-6 z-30 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => handleGenerateVideo(e, product)}
                      disabled={loadingVideos[product.handle]}
                      className="size-12 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group/vbtn border-4 border-black"
                    >
                      <span className={`material-symbols-outlined text-2xl font-black ${loadingVideos[product.handle] ? 'animate-spin' : ''}`}>
                        {loadingVideos[product.handle] ? 'sync' : 'movie_filter'}
                      </span>
                      <div className="absolute top-0 right-full mr-4 bg-black border border-primary/30 px-3 py-1 text-[8px] font-black uppercase tracking-widest whitespace-nowrap hidden group-hover/vbtn:block text-primary">
                        {loadingVideos[product.handle] ? 'SYNTHESIZING...' : (videoPreviews[product.handle] ? 'RE-RENDER' : 'RENDER PREVIEW')}
                      </div>
                    </button>

                    <button 
                      onClick={(e) => handleSpeakProtocol(e, product)}
                      disabled={loadingVoice[product.handle]}
                      className={`size-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group/sbtn border-4 border-black ${loadingVoice[product.handle] ? 'bg-white text-black animate-pulse' : 'bg-neutral-800 text-primary hover:bg-primary hover:text-black'}`}
                    >
                      <span className={`material-symbols-outlined text-2xl font-black ${loadingVoice[product.handle] ? 'animate-bounce' : ''}`}>
                        {loadingVoice[product.handle] ? 'graphic_eq' : 'volume_up'}
                      </span>
                      <div className="absolute top-0 right-full mr-4 bg-black border border-primary/30 px-3 py-1 text-[8px] font-black uppercase tracking-widest whitespace-nowrap hidden group-hover/sbtn:block text-primary">
                        {loadingVoice[product.handle] ? 'BROADCASTING...' : 'HEAR PROTOCOL'}
                      </div>
                    </button>
                  </div>

                  {/* Rendering Overlay */}
                  {loadingVideos[product.handle] && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 text-center">
                      <div className="size-16 border-2 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_#00FF7F]"></div>
                      <p className="text-[9px] text-primary font-black uppercase tracking-[0.4em] animate-pulse">
                        {videoStatus[product.handle] || "Connecting to Render Node..."}
                      </p>
                    </div>
                  )}

                  {/* Error Overlay */}
                  {errors[product.handle] && (
                    <div className="absolute inset-0 bg-safety-orange/20 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 text-center">
                      <span className="material-symbols-outlined text-safety-orange text-4xl mb-4">report</span>
                      <p className="text-[8px] text-white font-black uppercase tracking-widest">
                        {errors[product.handle]}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 transition-all duration-500 pointer-events-none"></div>
                </div>

                <div className="p-10 relative bg-neutral-900/40 backdrop-blur-md border-t border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="size-1 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors">{product.category}</p>
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-10 group-hover:text-primary transition-colors min-h-[72px] leading-none text-white">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-8">
                    <p className="font-mono text-3xl font-black text-white">${product.price}</p>
                    <div className="group/btn relative px-8 py-4 overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
                      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] group-hover/btn:text-black transition-colors text-neutral-300">Open Matrix</span>
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-48 text-center border border-dashed border-white/5 bg-white/[0.01] animate-pulse rounded-2xl">
            <span className="material-symbols-outlined text-8xl text-neutral-900 mb-10">satellite_alt</span>
            <h4 className="font-display text-3xl font-bold uppercase text-neutral-700 mb-4 tracking-tighter">Sector Unresponsive</h4>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-neutral-800">Search query returned zero vitality hits in the protocol helix.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProtocolStore;
