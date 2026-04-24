import React from 'react';
import { ShieldCheck, Droplets, Clock3, Award } from 'lucide-react';

const badges = [
  { iconName: 'shield', label: '安全无毒', sub: 'FDA认证', color: 'rgba(52,211,153,1)', bg: 'rgba(209,250,229,0.6)' },
  { iconName: 'droplets', label: '水性颜料', sub: '轻松卸妆', color: 'rgba(96,165,250,1)', bg: 'rgba(219,234,254,0.6)' },
  { iconName: 'clock', label: '持久4-6h', sub: '全天不褪色', color: 'rgba(251,146,60,1)', bg: 'rgba(255,237,213,0.6)' },
  { iconName: 'award', label: '专业画师', sub: '10年经验', color: 'rgba(236,72,153,1)', bg: 'rgba(252,231,243,0.6)' },
];

const iconMap = {
  shield: ({ size, style }) => <ShieldCheck size={size} style={style} />,
  droplets: ({ size, style }) => <Droplets size={size} style={style} />,
  clock: ({ size, style }) => <Clock3 size={size} style={style} />,
  award: ({ size, style }) => <Award size={size} style={style} />,
};

const ServiceBadges = () => {
  return (
    <div data-cmp="ServiceBadges" className="px-4 py-4">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {badges.map((b, i) => {
          const Icon = iconMap[b.iconName];
          return (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 pt-3 pb-2.5 rounded-2xl border border-[rgba(255,255,255,0.8)]"
              style={{ background: b.bg, minWidth: '78px' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <Icon size={18} style={{ color: b.color }} />
              </div>
              <span className="text-[12px] font-bold text-foreground leading-none">{b.label}</span>
              <span className="text-[10px] text-muted-foreground leading-none">{b.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceBadges;
