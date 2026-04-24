import React from 'react';
import { ChevronRight, Gamepad2, BookOpen, Palette, Music, Dumbbell, Camera, Leaf, Coffee } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Banner from '../components/Banner';
import HotCircleCard from '../components/HotCircleCard';
import TopicItem from '../components/TopicItem';
import BottomNav from '../components/BottomNav';

const Community = () => {
  return (
    <div className="min-h-screen bg-[rgba(236,249,243,1)] flex justify-center font-sans">
      <div className="w-full max-w-[414px] bg-[rgba(244,251,248,1)] relative shadow-[0_0_40px_rgba(16,185,129,0.05)] overflow-hidden flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
          <div className="px-5 pt-4 pb-1">
            <p className="text-[11px] text-[rgba(148,179,161,1)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgba(52,211,153,1)]"></span>
              今日 8,821 人在社区
            </p>
          </div>

          <SearchBar />
          <Banner />

          <div className="px-4 mb-8">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[18px] font-bold text-[rgba(22,51,38,1)] flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-[rgba(52,211,153,1)] to-[rgba(16,185,129,1)] rounded-full"></span>
                热门圈子
                <span className="text-[11px] font-normal text-[rgba(148,179,161,1)] ml-1">点击直接进入</span>
              </h2>
              <span className="text-[12px] text-[rgba(113,142,126,1)] flex items-center cursor-pointer hover:text-[rgba(16,185,129,1)] transition-colors">
                全部 <ChevronRight size={12} />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HotCircleCard title="一起玩" subtitle="游戏娱乐" users="2.3k" icon={Gamepad2} bgColor="rgba(255,255,255,0.7)" iconColor="rgba(16,185,129,1)" isHot={true} />
              <HotCircleCard title="学一学" subtitle="知识技能" users="1.8k" icon={BookOpen} bgColor="rgba(255,255,255,0.7)" iconColor="rgba(59,130,246,1)" />
              <HotCircleCard title="搞创作" subtitle="绘画手工" users="967" icon={Palette} bgColor="rgba(255,255,255,0.7)" iconColor="rgba(245,158,11,1)" isHot={true} />
              <HotCircleCard title="听音乐" subtitle="古典国风" users="3.1k" icon={Music} bgColor="rgba(255,255,255,0.7)" iconColor="rgba(139,92,246,1)" />
            </div>
          </div>

          <div className="mb-8">
            <div className="px-4 flex justify-between items-end mb-4">
              <h2 className="text-[18px] font-bold text-[rgba(22,51,38,1)] flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-[rgba(52,211,153,1)] to-[rgba(16,185,129,1)] rounded-full"></span>
                更多兴趣圈
              </h2>
              <span className="text-[12px] text-[rgba(113,142,126,1)] flex items-center cursor-pointer hover:text-[rgba(16,185,129,1)] transition-colors">
                发现更多 <ChevronRight size={12} />
              </span>
            </div>
            <div className="flex overflow-x-auto no-scrollbar px-4 gap-4 pb-2">
              {[
                { icon: Dumbbell, name: '健身打卡', count: '4.2k', color: 'rgba(16,185,129,1)', bg: 'rgba(209,250,229,0.5)' },
                { icon: Camera, name: '摄影圈', count: '2.9k', color: 'rgba(59,130,246,1)', bg: 'rgba(219,234,254,0.5)' },
                { icon: Leaf, name: '自然观察', count: '1.6k', color: 'rgba(5,150,105,1)', bg: 'rgba(209,250,229,0.8)' },
                { icon: Coffee, name: '茶道雅集', count: '890', color: 'rgba(217,119,6,1)', bg: 'rgba(254,243,199,0.5)' },
                { icon: Palette, name: '插画交流', count: '1.1k', color: 'rgba(236,72,153,1)', bg: 'rgba(252,231,243,0.5)' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center min-w-[64px] cursor-pointer group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-[rgba(255,255,255,0.8)] group-hover:scale-105 transition-transform" style={{ backgroundColor: item.bg }}>
                    <item.icon size={24} color={item.color} strokeWidth={1.5} />
                  </div>
                  <span className="text-[12px] font-medium text-[rgba(22,51,38,1)]">{item.name}</span>
                  <span className="text-[10px] text-[rgba(148,179,161,1)] mt-0.5">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mb-4">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[18px] font-bold text-[rgba(22,51,38,1)] flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-[rgba(245,158,11,1)] to-[rgba(239,68,68,1)] rounded-full"></span>
                🔥 热门话题
              </h2>
              <span className="text-[12px] text-[rgba(113,142,126,1)] flex items-center cursor-pointer hover:text-[rgba(16,185,129,1)] transition-colors">
                更多 <ChevronRight size={12} />
              </span>
            </div>
            <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-md rounded-2xl p-2 border border-[rgba(255,255,255,0.8)] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <TopicItem rank={1} title="#汉服穿搭" views="12.4万" icon={Leaf} iconColor="rgba(16,185,129,1)" />
              <TopicItem rank={2} title="#古风摄影" views="8.9万" icon={Camera} iconColor="rgba(236,72,153,1)" />
              <TopicItem rank={3} title="#非遗传承" views="6.2万" icon={BookOpen} iconColor="rgba(217,119,6,1)" />
              <TopicItem rank={4} title="#国风音乐" views="5.5万" icon={Music} iconColor="rgba(59,130,246,1)" />
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Community;
