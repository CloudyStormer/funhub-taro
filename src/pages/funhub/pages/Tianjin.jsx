import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

const Tianjin = () => {
  return (
    <div className="min-h-screen bg-transparent flex justify-center items-start md:py-8">
      <div className="w-full max-w-md bg-background min-h-[100dvh] md:min-h-[850px] md:h-[90vh] md:rounded-[2.5rem] md:shadow-2xl md:border-8 border-white/40 overflow-hidden relative flex flex-col px-6">
        <div className="py-6 flex items-center">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(230,57,40,0.10)' }}>
            <MapPin size={32} style={{ color: 'rgba(230,57,40,1)' }} />
          </div>
          <h1 className="text-2xl font-medium tracking-widest text-foreground mb-4">津门风物</h1>
          <p className="text-muted-foreground tracking-wide max-w-[80%]">
            煎饼果子，相声快板。<br/>天津文旅模块正在筹备中...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tianjin;