import React from 'react';
import { Flame, User, Compass, MessageSquare, Plus } from 'lucide-react';

const BottomNav = () => {
  return (
    <div data-cmp="BottomNav" className="absolute bottom-0 w-full h-[70px] bg-[rgba(255,255,255,0.92)] backdrop-blur-lg rounded-t-3xl shadow-[0_-8px_30px_rgba(16,185,129,0.06)] border-t border-[rgba(255,255,255,1)] z-50 px-6">
      <div className="flex justify-between items-center h-full relative">
        <div className="flex gap-8 w-1/3 justify-center">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <Flame size={22} className="text-[rgba(16,185,129,1)] transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-bold text-[rgba(16,185,129,1)]">动态</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <Compass size={22} className="text-[rgba(148,179,161,1)] transition-colors group-hover:text-[rgba(16,185,129,1)]" />
            <span className="text-[10px] font-medium text-[rgba(148,179,161,1)] group-hover:text-[rgba(16,185,129,1)]">发现</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[rgba(52,211,153,0.4)] rounded-full blur-md transform scale-110"></div>
            <button className="relative w-[56px] h-[56px] rounded-full bg-gradient-to-tr from-[rgba(16,185,129,1)] to-[rgba(52,211,153,1)] shadow-[0_8px_20px_rgba(16,185,129,0.3)] flex justify-center items-center border-[4px] border-[rgba(255,255,255,1)] transform hover:scale-105 active:scale-95 transition-all">
              <Plus className="text-[rgba(255,255,255,1)]" size={28} strokeWidth={2.5} />
            </button>
          </div>
          <span className="text-[11px] font-bold text-[rgba(22,51,38,1)] mt-1.5 drop-shadow-sm">发布</span>
        </div>

        <div className="flex gap-8 w-1/3 justify-center">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <MessageSquare size={22} className="text-[rgba(148,179,161,1)] transition-colors group-hover:text-[rgba(16,185,129,1)]" />
            <span className="text-[10px] font-medium text-[rgba(148,179,161,1)] group-hover:text-[rgba(16,185,129,1)]">消息</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <User size={22} className="text-[rgba(148,179,161,1)] transition-colors group-hover:text-[rgba(16,185,129,1)]" />
            <span className="text-[10px] font-medium text-[rgba(148,179,161,1)] group-hover:text-[rgba(16,185,129,1)]">我的</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
