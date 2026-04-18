import React from 'react';
import { Activity, BookOpen, Palette, MapPin } from 'lucide-react';
import TopBar from '../components/TopBar';
import ModuleCard from '../components/ModuleCard';

const Home = () => {
    console.log("Home page rendered with ice-jade green background");

    return (
        <div className="min-h-screen bg-transparent flex justify-center items-start md:py-8 font-sans">
            <div className="w-full max-w-md bg-[rgba(253,250,245,0.9)] min-h-[100dvh] md:min-h-[850px] md:h-[90vh] md:rounded-[3rem] md:shadow-2xl md:border-[12px] border-white/80 overflow-hidden relative flex flex-col">

                {/* === 冰种山水绿 Ambient Background Glows === */}
                <div className="absolute -top-20 -left-20 w-[20rem] h-[20rem] bg-[rgba(79,161,152,0.25)] rounded-full blur-[80px] pointer-events-none z-0"></div>
                <div className="absolute top-1/4 -right-32 w-[24rem] h-[24rem] bg-[rgba(140,210,200,0.2)] rounded-full blur-[80px] pointer-events-none z-0"></div>
                <div className="absolute -bottom-32 -left-10 w-[20rem] h-[20rem] bg-[rgba(79,161,152,0.15)] rounded-full blur-[100px] pointer-events-none z-0"></div>

                {/* <TopBar /> */}

                <div className="flex-1 overflow-y-auto px-5 pb-12 no-scrollbar z-10 relative">

                    {/* 头部区域 — 飞鸟在此区域内飞行 */}
                    <div className="pt-5 pb-6 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden rounded-3xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[rgba(255,220,200,0.4)] rounded-full blur-3xl pointer-events-none"></div>

                        {/* 飞鸟 */}
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <svg key={n} className={`bird bird-${n}`}
                            width={n % 3 === 0 ? 16 : n % 2 === 0 ? 22 : 26}
                            height={n % 3 === 0 ? 8  : n % 2 === 0 ? 11 : 13}
                            viewBox="0 0 28 14" fill="none">
                            <path d="M0 8 Q7 0 14 6 Q21 0 28 8" stroke="rgba(90,130,120,0.32)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                          </svg>
                        ))}

                        <img
                            src={`${process.env.PUBLIC_URL}/logo.png`}
                            alt="花果山有点东西"
                            className="w-32 h-auto rounded-2xl drop-shadow-xl hover:scale-105 transition-transform duration-500 relative z-10 logo-drop-bounce"
                        />
                        <p className="text-[rgba(140,110,80,1)] font-medium text-sm mt-2 tracking-widest relative z-10">
                            探索生活里的七十二变
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
                        <ModuleCard
                            title="职场英语"
                            subtitle="看世界 🥨"
                            path="/english"
                            icon={BookOpen}
                            delay={100}
                            className="col-span-2 min-h-[140px] border-white/60"
                            bgColor="bg-[rgba(0,194,184,0.1)]"
                            iconBgColor="bg-[rgba(79,161,152,1)]"
                            iconColor="text-white"
                            decorationEmoji={<span className="text-6xl drop-shadow-md">🎡</span>}
                            isFeatured={true}
                            featuredColor="79, 161, 152"
                        />

                        <ModuleCard
                            title="糖果彩绘"
                            subtitle="色彩与甜蜜"
                            icon={Palette}
                            path="/painting"
                            delay={200}
                            className="col-span-1 min-h-[220px] border-white/60"
                            bgColor="bg-[rgba(255,220,225,0.4)]"
                            iconBgColor="bg-[rgba(240,110,130,1)]"
                            iconColor="text-white"
                            decorationEmoji={<span className="text-5xl drop-shadow-md top-2 right-0 relative">🍬</span>}
                            isFeatured={true}
                            featuredColor="240, 110, 130"
                        />

                        <div className="col-span-1 flex flex-col gap-4">
                            <ModuleCard
                                title="修身健体"
                                subtitle="元气满满"
                                icon={Activity}
                                path="/fitness"
                                delay={300}
                                className="flex-1 min-h-[100px] border-white/60"
                                bgColor="bg-[rgba(210,156,56,0.15)]"
                                iconBgColor="bg-[rgba(210,156,56,1)]"
                                iconColor="text-white"
                                isUnderConstruction={true}
                            />

                            <ModuleCard
                                title="津门风物"
                                subtitle="美食文旅"
                                icon={MapPin}
                                path="/tianjin"
                                delay={400}
                                className="flex-1 min-h-[100px] border-white/60"
                                bgColor="bg-[rgba(230,57,40,0.1)]"
                                iconBgColor="bg-[rgba(230,57,40,1)]"
                                iconColor="text-white"
                                isUnderConstruction={true}
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500 relative z-10">
                        <div className="inline-block px-6 py-2 rounded-full bg-white/40 glass-effect border border-white/60 shadow-sm hover:scale-105 transition-transform cursor-default">
                            <p className="text-[rgba(230,57,40,1)] text-sm font-bold tracking-wider">
                                🐒 翻个筋斗云，发现新乐趣
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;