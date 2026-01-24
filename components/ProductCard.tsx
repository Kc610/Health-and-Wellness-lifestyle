
import React, { useRef, useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const hoverImage = product.gallery && product.gallery.length > 1 ? product.gallery[1] : product.image;

  return (
    <div 
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`View detailed protocol intel for ${product.title}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer relative bg-surface-dark border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 hover:border-primary/50"
      style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out' }}
    >
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 transition-colors duration-300 pointer-events-none z-10"></div>
      
      <div className="aspect-[4/5] overflow-hidden bg-black relative">
        <img 
          src={product.image} 
          alt={product.title} 
          loading="lazy"
          className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ${hoverImage !== product.image ? 'group-hover:opacity-0' : ''}`} 
        />
        {hoverImage !== product.image && (
           <img 
             src={hoverImage} 
             alt={`${product.title} alternate view`}
             loading="lazy"
             className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100"
           />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <p className="text-[9px] font-black uppercase tracking-wider bg-black/90 px-3 py-1 border border-white/20 text-primary backdrop-blur-sm group-hover:bg-primary group-hover:text-black transition-colors">
            {product.sku}
          </p>
        </div>
      </div>

      <div className="p-8 relative z-10 bg-surface-dark">
        <div className="flex items-center gap-2 mb-3">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">{product.category}</p>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-8 text-white group-hover:text-primary transition-colors min-h-[64px] leading-tight">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <p className="font-mono text-2xl font-black text-white">${product.price}</p>
          <div className="group/btn relative px-6 py-3 overflow-hidden border border-white/20 group-hover:border-primary/50 transition-colors">
            <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover/btn:text-black transition-colors">Open Matrix</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
