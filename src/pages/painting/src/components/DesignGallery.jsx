import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const categories = ['全部', '蝴蝶', '独角兽', '花卉', '超级英雄'];

const designs = [
  {
    id: 1,
    name: '梦幻蝴蝶',
    category: '蝴蝶',
    tags: ['超人气', '甜美'],
    price: '¥68',
    likes: 328,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(244,114,182,0.75)',
  },
  {
    id: 2,
    name: '星空独角兽',
    category: '独角兽',
    tags: ['魔法', '闪亮'],
    price: '¥88',
    likes: 512,
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(192,132,252,0.75)',
  },
  {
    id: 3,
    name: '百花仙子',
    category: '花卉',
    tags: ['气质', '清新'],
    price: '¥78',
    likes: 241,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(52,211,153,0.75)',
  },
  {
    id: 4,
    name: '粉色精灵',
    category: '蝴蝶',
    tags: ['可爱', '粉嫩'],
    price: '¥68',
    likes: 189,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(251,146,60,0.75)',
  },
];

const DesignGallery = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [likedIds, setLikedIds] = useState([]);

  const filtered =
    activeCategory === '全部' ? designs : designs.filter((d) => d.category === activeCategory);

  const toggleLike = (id) => {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div data-cmp="DesignGallery" className="pt-2 pb-2">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-[17px] font-extrabold text-foreground flex items-center gap-1.5">
          <Sparkles size={17} className="text-primary" />
          热门魔法图案
        </h2>
        <span className="text-[12px] text-muted-foreground">共 {designs.length} 款</span>
      </div>

      <div className="flex gap-2 px-5 mb-4 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: activeCategory === cat ? 'rgba(236,72,153,1)' : 'rgba(248,240,252,1)',
              color: activeCategory === cat ? 'rgba(255,255,255,1)' : 'rgba(148,120,148,1)',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(236,72,153,0.25)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 pb-3">
        {filtered.map((design) => {
          const isLiked = likedIds.includes(design.id);
          return (
            <div
              key={design.id}
              className="flex-shrink-0 bg-card rounded-3xl overflow-hidden border border-border shadow-custom"
              style={{ width: '195px' }}
            >
              <div className="relative w-full h-[140px]">
                <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${design.gradientFrom}, transparent)`, opacity: 0.65 }}
                />
                <div className="absolute bottom-2.5 left-2.5 flex gap-1">
                  {design.tags.map((tag, idx) => (
                    <span key={idx} className="tag-pill">{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => toggleLike(design.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[rgba(255,255,255,0.22)] backdrop-blur-sm flex items-center justify-center border border-[rgba(255,255,255,0.35)] transition-transform active:scale-90"
                >
                  <Heart
                    size={14}
                    className={isLiked ? 'text-primary fill-primary' : 'text-primary-foreground'}
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
              <div className="px-3.5 pt-2.5 pb-3">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-[14px] font-bold text-foreground">{design.name}</h3>
                  <span className="text-[13px] font-extrabold text-primary">{design.price}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Heart size={10} className="text-primary fill-primary" />
                  <span>{(design.likes + (likedIds.includes(design.id) ? 1 : 0)).toLocaleString()} 喜欢</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesignGallery;
