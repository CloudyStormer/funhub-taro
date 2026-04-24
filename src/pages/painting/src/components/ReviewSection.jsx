import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: '小橙子妈妈',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: `宝贝画完超级开心！蝴蝶图案太精致了，颜色很鲜艳，玩了一下午都没掉色，强烈推荐！`,
    design: '梦幻蝴蝶',
  },
  {
    id: 2,
    name: '萌萌爸比',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: `第一次带女儿来体验，完全超出预期！画师很有耐心，孩子全程配合，独角兽真的太美了。`,
    design: '星空独角兽',
  },
  {
    id: 3,
    name: 'Coco小公主',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: `已经来了三次了！每次图案都不一样，女儿最喜欢百花仙子，下次要试蝴蝶款！`,
    design: '百花仙子',
  },
];

const ReviewSection = () => {
  return (
    <div data-cmp="ReviewSection" className="py-4">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-[17px] font-extrabold text-foreground flex items-center gap-1.5">
          <Star size={17} className="text-accent fill-accent" />
          真实用户评价
        </h2>
        <div className="flex items-center gap-1">
          <Star size={12} className="text-accent fill-accent" />
          <span className="text-[13px] font-bold text-foreground">4.9</span>
          <span className="text-[11px] text-muted-foreground ml-0.5">/ 5.0</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="flex-shrink-0 bg-card rounded-2xl p-4 border border-border shadow-custom"
            style={{ width: '240px' }}
          >
            <Quote size={18} className="text-primary mb-2" style={{ opacity: 0.35 }} />
            <p className="text-[12.5px] text-foreground leading-relaxed mb-3 line-clamp-3">{r.text}</p>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Star key={i} size={11} className="text-accent fill-accent" />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover border-2 border-border" />
              <div>
                <p className="text-[12px] font-bold text-foreground leading-none">{r.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">体验了 · {r.design}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
