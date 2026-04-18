import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, HardHat } from 'lucide-react';

const ModuleCard = ({ 
  title = "模块名称", 
  subtitle = "副标题", 
  icon: Icon = ArrowUpRight, 
  path = "/",
  delay = 0,
  className = "",
  bgColor = "bg-card",
  iconBgColor = "bg-muted",
  iconColor = "text-foreground",
  decorationEmoji = "",
  isUnderConstruction = false,
  isFeatured = false,
  featuredColor = "79, 161, 152",
}) => {
  console.log("ModuleCard rendered:", title, "featured=", isFeatured, "construction=", isUnderConstruction);

  // Under construction: greyed out, not clickable
  if (isUnderConstruction) {
    return (
      <div
        data-cmp="ModuleCard"
        className={`group relative overflow-hidden glass-effect border-2 border-white/30 rounded-[2rem] shadow-custom flex flex-col animate-in fade-in slide-in-from-bottom-8 cursor-not-allowed select-none grayscale ${className}`}
        style={{
          animationDelay: `${delay}ms`,
          animationFillMode: 'both',
          background: 'rgba(220, 218, 215, 0.45)',
        }}
      >
        {/* Card content with reduced visibility */}
        <div className="p-5 flex flex-col flex-1 opacity-40">
          {decorationEmoji !== "" && (
            <div className="absolute -right-2 -top-2 opacity-40 pointer-events-none">
              <span className="text-5xl drop-shadow-md">{decorationEmoji}</span>
            </div>
          )}

          <div className={`mb-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl ${iconBgColor} ${iconColor} shadow-sm border border-white/50 z-10`}>
            {Icon && <Icon size={24} strokeWidth={2} />}
          </div>

          <div className="mt-4 z-10">
            <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-60 text-foreground">{subtitle}</p>
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <ArrowUpRight size={16} className="text-foreground opacity-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Full-cover frosted overlay */}
        <div className="absolute inset-0 rounded-[2rem] z-30 pointer-events-none flex flex-col items-center justify-center bg-white/30 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-1.5 px-4 py-2">
            <HardHat size={22} className="text-[rgba(120,115,108,0.85)]" />
            <span className="text-[11px] font-bold tracking-[0.15em] text-[rgba(100,96,90,0.85)]">建造中</span>
          </div>
        </div>
      </div>
    );
  }

  // Featured card: glowing border, "已开张" badge, breathing box-shadow
  if (isFeatured) {
    return (
      <Link
        to={path}
        data-cmp="ModuleCard"
        className={`group relative overflow-hidden ${bgColor} glass-effect rounded-[2rem] p-5 flex flex-col featured-card-glow hover:-translate-y-1.5 transition-transform duration-400 ${className}`}
        style={{
          '--featured-color': featuredColor,
          border: `2.5px solid rgba(${featuredColor}, 0.6)`,
        }}
      >
        {/* Top inner glow */}
        <div
          className="absolute top-0 left-0 right-0 h-24 rounded-t-[2rem] pointer-events-none z-0"
          style={{ background: `linear-gradient(180deg, rgba(${featuredColor}, 0.12) 0%, transparent 100%)` }}
        ></div>

        {/* "已开张" badge — top left */}
        <div
          className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: `rgba(${featuredColor}, 1)`, boxShadow: `0 2px 8px rgba(${featuredColor}, 0.5)` }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-[11px] font-bold text-white tracking-wider">已开张</span>
        </div>

        {/* Decoration emoji */}
        {decorationEmoji !== "" && (
          <div className="absolute -right-2 -top-2 opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 z-10">
            <span className="text-6xl drop-shadow-md">{decorationEmoji}</span>
          </div>
        )}

        {/* Icon */}
        <div className={`mb-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl ${iconBgColor} ${iconColor} group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white/50 z-10 relative mt-8`}>
          {Icon && <Icon size={24} strokeWidth={2} />}
        </div>

        {/* Text */}
        <div className="mt-4 z-10 relative">
          <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium opacity-70 text-foreground">{subtitle}</p>
            <div
              className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white transition-colors border border-white/80"
              style={{ boxShadow: `0 0 8px rgba(${featuredColor}, 0.3)` }}
            >
              <ArrowUpRight size={16} style={{ color: `rgba(${featuredColor}, 1)` }} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Normal card
  return (
    <Link 
      to={path}
      data-cmp="ModuleCard"
      className={`group relative overflow-hidden ${bgColor} glass-effect border-2 border-white rounded-[2rem] p-5 shadow-custom hover:shadow-hover transition-all duration-400 hover:-translate-y-1.5 flex flex-col animate-in fade-in slide-in-from-bottom-8 ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {decorationEmoji !== "" && (
        <div className="absolute -right-2 -top-2 opacity-80 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
          <span className="text-5xl drop-shadow-md">{decorationEmoji}</span>
        </div>
      )}

      <div className={`mb-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl ${iconBgColor} ${iconColor} group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white/50 z-10`}>
        {Icon && <Icon size={24} strokeWidth={2} />}
      </div>

      <div className="mt-4 z-10">
        <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium opacity-70 text-foreground">{subtitle}</p>
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
            <ArrowUpRight size={16} className="text-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ModuleCard;