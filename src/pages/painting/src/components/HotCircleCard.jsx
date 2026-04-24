import React from 'react';

const HotCircleCard = ({ title, subtitle, users, icon: Icon, bgColor, iconColor, isHot = false }) => {
  return (
    <div data-cmp="HotCircleCard" className="relative rounded-2xl p-4 transition-transform hover:scale-[1.02] cursor-pointer border border-[rgba(255,255,255,0.5)] shadow-[0_2px_12px_rgba(0,0,0,0.02)]" style={{ backgroundColor: bgColor }}>
      {isHot && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[rgba(248,113,113,1)] to-[rgba(239,68,68,1)] text-[rgba(255,255,255,1)] text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-2xl flex items-center gap-0.5 shadow-sm">
          🔥 热
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 transform transition-transform group-hover:scale-110">
          <Icon size={36} color={iconColor} strokeWidth={1.5} />
        </div>
        <h4 className="text-[15px] font-bold text-[rgba(22,51,38,1)] mb-0.5">{title}</h4>
        <p className="text-[11px] text-[rgba(100,130,115,1)] mb-2">{subtitle}</p>
        <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] text-[rgba(60,95,78,1)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[rgba(52,211,153,1)]"></span>
          {users}在玩
        </div>
      </div>
    </div>
  );
};

export default HotCircleCard;
