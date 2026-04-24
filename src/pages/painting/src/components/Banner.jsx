import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const Banner = () => {
  return (
    <div data-cmp="Banner" className="px-4 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[rgba(167,243,208,1)] to-[rgba(110,231,183,1)] p-4 shadow-[0_4px_16px_rgba(16,185,129,0.15)] flex items-center justify-between border border-[rgba(255,255,255,0.6)]">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[rgba(255,255,255,0.2)] rounded-full blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-[rgba(52,211,153,0.3)] rounded-full blur-lg"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.9)] rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="text-[rgba(16,185,129,1)]" size={24} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[rgba(22,51,38,1)] flex items-center gap-1">新手村开放啦！</h3>
            <p className="text-[12px] text-[rgba(30,82,59,0.8)] mt-0.5">快来认识志同道合的小伙伴</p>
          </div>
        </div>
        <div className="flex items-center text-[rgba(22,51,38,0.8)] text-[13px] font-medium relative z-10 bg-[rgba(255,255,255,0.4)] px-3 py-1.5 rounded-full backdrop-blur-sm">
          进入 <ChevronRight size={14} className="ml-0.5" />
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        <div className="w-4 h-1.5 bg-[rgba(16,185,129,1)] rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[rgba(167,243,208,1)] rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[rgba(167,243,208,1)] rounded-full"></div>
      </div>
    </div>
  );
};

export default Banner;
