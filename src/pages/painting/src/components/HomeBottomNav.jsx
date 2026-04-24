import React from 'react';
import { Home, Palette, CalendarHeart, User } from 'lucide-react';

const tabs = [
  { key: 'home', label: '首页', iconName: 'home' },
  { key: 'gallery', label: '图案', iconName: 'palette' },
  { key: 'booking', label: '预约', iconName: 'calendar' },
  { key: 'profile', label: '我的', iconName: 'user' },
];

const TabIcon = ({ iconName, isActive }) => {
  const cls = isActive ? 'text-primary' : 'text-muted-foreground';
  const size = 22;
  if (iconName === 'home') return <Home size={size} className={cls} />;
  if (iconName === 'palette') return <Palette size={size} className={cls} />;
  if (iconName === 'calendar') return <CalendarHeart size={size} className={cls} />;
  if (iconName === 'user') return <User size={size} className={cls} />;
  return <Home size={size} className={cls} />;
};

const HomeBottomNav = ({ activeTab = 'home', onTabChange = () => {} }) => {
  return (
    <div
      data-cmp="HomeBottomNav"
      className="absolute bottom-0 left-0 right-0 h-[68px] bg-card border-t border-border z-50 px-2"
      style={{ boxShadow: '0 -4px 24px rgba(236,72,153,0.06)' }}
    >
      <div className="flex justify-around items-center h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                onTabChange(tab.key);
                if (tab.key === 'booking') {
                  document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all active:scale-90"
            >
              <TabIcon iconName={tab.iconName} isActive={isActive} />
              <span
                className="text-[10px] font-semibold transition-colors"
                style={{ color: isActive ? 'rgba(236,72,153,1)' : 'rgba(148,120,148,1)' }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-1.5 w-4 h-0.5 rounded-full"
                  style={{ background: 'rgba(236,72,153,1)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HomeBottomNav;
