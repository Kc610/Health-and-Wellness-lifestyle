
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../services/products';
import { generateProductIntel, speakProtocol, NeuralLinkError, generateProductVideo } from '../services/gemini';
import { sounds } from '../services/ui-sounds';
import Logo from './Logo';

const ProductDetail: React.FC = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.handle === handle);
  
  const [intelReport, setIntelReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoStatus, setVideoStatus] = useState("");
  
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      if (currentAudioSource.current) {
        currentAudioSource.current.stop();
      }
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [handle]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center" role="alert">
          <h2 className="font-display text-4xl font-black text-white uppercase mb-4">Protocol Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            aria-label="Return to the main product feed"
            className="text-primary hover:text-white font-mono text-xs uppercase tracking-widest"
          >
            [ Return to Collective Feed ]
          </button>
        </div>
      </div>
    );
  }

  const handleDecompile = async () => {
    sounds.playInject();
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

  const handleGenerateVideo = async () => {
    if (isVideoLoading) return;
    sounds.playInject();
    setIsVideoLoading(true);
    setVideoStatus("Initializing Veo Node...");
    try {
      const url = await generateProductVideo(product.title, (status) => setVideoStatus(status));
      setVideoUrl(url);
      sounds.playBlip();
    } catch (e) {
      setError(e instanceof NeuralLinkError ? e.message : "VIDEO KINETIC FAIL");
    } finally {
      setIsVideoLoading(false);
    }
  };

  const galleryImages = product.gallery?.filter(img => img !== product.image) || [];

  return (
    <div className="min-h-screen bg-background-dark text-white pt-32 pb-20 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-8">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => navigate('/')}
          aria-label="Navigate back to the protocol catalog"
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 hover:text-primary transition-colors mb-16"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform" aria-hidden="true">arrow_back</span>
          Back to Protocols
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left Column: Visuals */}
          <div className="lg:col-span-6 space-y-10">
            <div className="aspect-square bg-surface-dark border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000"
                />
              ) : (
                <img 
                  src={product.image} 
                  alt={`${product.title} high-resolution visual`}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              )}

              <div className="absolute top-6 left-6 z-20">
                <span className="bg-black/80 backdrop-blur-md border border-primary/30 px-4 py-2 text-[10px] font-mono text-primary uppercase tracking-widest">
                  {product.sku} // {videoUrl ? 'KINETIC FEED' : 'COREID'}
                </span>
              </div>
              
              {/* Image HUD Effects */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/10 animate-scan"></div>
              </div>

              {isVideoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl z-30">
                  <div className="size-24 border-2 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                  <p className="text-primary font-mono text-xs font-black uppercase tracking-[0.4em] animate-pulse px-8 text-center">{videoStatus}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Quality Tier', value: 'S-GRADE' },
                { label: 'Origin', value: 'USA NODE' },
                { label: 'Latency', value: '0.1MS' }
              ].map(stat => (
                <div key={stat.label} className="p-6 bg-surface-dark border border-white/5 text-center">
                  <p className="text-[8px] text-neutral-600 font-black uppercase mb-1 tracking-widest">{stat.label}</p>
                  <p className="text-sm font-mono text-white uppercase">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Visual Recon Gallery - Hotlinked from HTML content */}
            {galleryImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 border-b border-white/10 pb-4">
                  Visual Recon Artifacts
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer">
                      <img 
                        src={img} 
                        alt={`Artifact ${idx}`}
                        className="w-full h-full object-contain p-4 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information & AI */}
          <div className="lg:col-span-6">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-2 bg-primary rounded-full animate-ping" aria-hidden="true"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{product.category}</p>
              </div>
              <h1 className="font-display text-6xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8">
                {product.title}
              </h1>
              <p className="font-mono text-4xl font-black text-white mb-8" aria-label={`Price: ${product.price} dollars`}>${product.price}</p>
              
              <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light leading-relaxed mb-12">
                <div dangerouslySetInnerHTML={{ __html: product.bodyHtml || product.description }}></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <button 
                onClick={() => sounds.playInject()}
                aria-label={`Dispatch ${product.title} to your bio-buffer`}
                className="flex-1 bg-white text-black py-6 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all active:scale-95 shadow-xl"
              >
                Secure Dispatch
              </button>
              <button 
                onClick={handleGenerateVideo}
                disabled={isVideoLoading}
                aria-label="Generate a kinetic neural video preview of this supplement"
                className="flex-1 border border-primary/30 bg-primary/5 text-primary py-6 font-black text-xs uppercase tracking-[0.3em] hover:bg-primary/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span className="material-symbols-outlined" aria-hidden="true">movie_filter</span>
                {videoUrl ? 'Re-generate Video' : 'Kinetic Preview'}
              </button>
            </div>

            {/* AI Intel Report Section */}
            {(intelReport || isGenerating || error) && (
              <div className="p-10 bg-black border border-primary/20 relative overflow-hidden animate-fade-in" role="region" aria-label="AI Intelligence Briefing">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-40"></div>
                
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                     <Logo className="size-6" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Briefing</h3>
                   </div>
                   {intelReport && (
                     <button 
                       onClick={handleSpeak}
                       aria-label={isSpeaking ? "Voice synchronization in progress" : "Read intelligence briefing aloud"}
                       className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isSpeaking ? 'text-primary' : 'text-neutral-500 hover:text-white'}`}
                     >
                       <span className={`material-symbols-outlined text-lg ${isSpeaking ? 'animate-pulse' : ''}`} aria-hidden="true">
                        {isSpeaking ? 'graphic_eq' : 'volume_up'}
                       </span>
                       {isSpeaking ? 'SYNCING VOICE...' : 'READ INTEL'}
                     </button>
                   )}
                </div>

                <div className="font-mono text-sm text-neutral-300 leading-relaxed min-h-[200px]">
                  {isGenerating ? (
                    <div className="space-y-6" aria-busy="true">
                      <div className="h-2 bg-white/5 w-full animate-shimmer"></div>
                      <div className="h-2 bg-white/5 w-[80%] animate-shimmer"></div>
                      <div className="h-2 bg-white/5 w-[90%] animate-shimmer"></div>
                      <p className="text-[9px] text-primary/40 uppercase tracking-[0.4em] text-center mt-8">Deciphering biological metadata...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8" role="alert">
                       <span className="material-symbols-outlined text-safety-orange text-4xl mb-4" aria-hidden="true">report</span>
                       <p className="text-safety-orange uppercase font-black text-xs tracking-widest">{error}</p>
                    </div>
                  ) : intelReport ? (
                    <div className={`animate-fade-in transition-all duration-700 ${isSpeaking ? 'text-primary drop-shadow-[0_0_8px_rgba(0,255,127,0.3)]' : ''}`}>
                      {intelReport}
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center gap-6">
                      <button 
                        onClick={handleDecompile}
                        className="text-primary hover:text-white font-black text-xs tracking-[0.4em] uppercase border-b border-primary/20 pb-2 transition-colors"
                      >
                        [ Initialize Intel Scan ]
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
