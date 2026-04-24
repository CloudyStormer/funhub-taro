import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
    tag: '✨ 超人气',
    title: '梦幻蝴蝶',
    subtitle: '为小公主画上奇妙色彩',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=900&auto=format&fit=crop',
    tag: '🦄 魔法',
    title: '星空独角兽',
    subtitle: '点亮派对每一刻',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=900&auto=format&fit=crop',
    tag: '🌸 清新',
    title: '百花仙子',
    subtitle: '环保水性，安心彩绘',
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <div data-cmp="HeroSection" className="relative w-full overflow-hidden" style={{ height: '340px' }}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,0,30,0.75)] via-[rgba(80,0,60,0.18)] to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(236,72,153,0.12)] to-[rgba(192,132,252,0.08)] z-10" />

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-xl bg-[rgba(255,255,255,0.18)] backdrop-blur-md flex items-center justify-center border border-[rgba(255,255,255,0.3)]">
            <Sparkles size={14} className="text-primary-foreground" />
          </div>
          <span className="text-[13px] font-bold text-primary-foreground tracking-wide">魔法脸绘</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.18)] backdrop-blur-md border border-[rgba(255,255,255,0.3)]">
          <span className="text-[11px] font-semibold text-primary-foreground">已服务 5000+ 家庭</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-7">
        <span className="inline-block text-[11px] font-bold text-primary-foreground bg-[rgba(236,72,153,0.55)] backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
          {slide.tag}
        </span>
        <h1 className="text-[28px] font-extrabold text-primary-foreground leading-tight mb-1 tracking-tight">
          {slide.title}
        </h1>
        <p className="text-[13px] text-[rgba(255,230,245,0.9)] mb-4">{slide.subtitle}</p>
        <button
          onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-[14px] shadow-[0_6px_20px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all"
        >
          立即预约彩绘
          <Sparkles size={15} />
        </button>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.18)] backdrop-blur-md flex items-center justify-center border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.3)] transition-colors"
      >
        <ChevronLeft size={16} className="text-primary-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.18)] backdrop-blur-md flex items-center justify-center border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.3)] transition-colors"
      >
        <ChevronRight size={16} className="text-primary-foreground" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '9999px',
              background: i === current ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
