import React from 'react';
import { ChevronRight } from 'lucide-react';

const TopicItem = ({ rank, title, views, icon: Icon, iconColor }) => {
  let rankBg = 'bg-[rgba(209,250,229,1)] text-[rgba(16,185,129,1)]';
  if (rank === 1) rankBg = 'bg-[rgba(254,240,138,1)] text-[rgba(202,138,4,1)]';
  if (rank === 2) rankBg = 'bg-[rgba(226,232,240,1)] text-[rgba(71,85,105,1)]';
  if (rank === 3) rankBg = 'bg-[rgba(255,237,213,1)] text-[rgba(194,65,12,1)]';

  return (
    <div data-cmp="TopicItem" className="flex items-center justify-between py-3.5 border-b border-[rgba(240,253,244,1)] last:border-0 hover:bg-[rgba(255,255,255,0.5)] rounded-xl px-2 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-bold ${rankBg}`}>
          {rank}
        </div>
        <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.8)] shadow-sm flex items-center justify-center border border-[rgba(240,253,244,1)]">
          <Icon size={16} color={iconColor} />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[rgba(22,51,38,1)] leading-tight">{title}</h4>
          <p className="text-[11px] text-[rgba(148,179,161,1)] mt-0.5">{views}讨论</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-[rgba(167,243,208,1)]" />
    </div>
  );
};

export default TopicItem;
