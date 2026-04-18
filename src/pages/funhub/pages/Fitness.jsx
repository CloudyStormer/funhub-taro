import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';

const Fitness = () => {
  return (
    <div className="min-h-screen bg-transparent flex justify-center items-start md:py-8">
      <div className="w-full max-w-md bg-background min-h-[100dvh] md:min-h-[850px] md:h-[90vh] md:rounded-[2.5rem] md:shadow-2xl md:border-8 border-white/40 overflow-hidden relative flex flex-col px-6">
        <div className="py-6 flex items-center">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(210,156,56,0.12)' }}>
            <Activity size={32} style={{ color: 'rgba(210,156,56,1)' }} />
          </div>
          <h1 className="text-2xl font-medium tracking-widest text-foreground mb-4">修身健体</h1>
          <p className="text-muted-foreground tracking-wide max-w-[80%]">
            动静相宜，调理气息。<br/>健身模块正在筹备中...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fitness;