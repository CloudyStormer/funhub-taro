import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

const TopBar = () => {
  return (
    <div data-cmp="TopBar" className="flex items-center justify-between px-6 py-5 pt-8 bg-transparent sticky top-0 z-20">
      <div className="flex items-center space-x-2 bg-white/60 glass-effect px-4 py-2 rounded-full shadow-sm border border-white">
        <Sparkles size={16} className="text-[rgba(230,57,40,1)]" />
        <span className="font-medium text-sm tracking-widest text-[rgba(230,57,40,1)]">今日宜开心</span>
      </div>
      <div className="w-10 h-10 bg-white/80 glass-effect rounded-full flex items-center justify-center shadow-sm border border-white cursor-pointer hover:scale-105 transition-transform">
        <Menu size={20} className="text-foreground" />
      </div>
    </div>
  );
};

export default TopBar;