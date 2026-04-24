import React from 'react';
import { PhoneCall, MessageCircle, Sparkles, MapPin, Clock } from 'lucide-react';

const ContactCard = () => {
  return (
    <div data-cmp="ContactCard" className="px-4 pb-4">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-custom relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl z-0" style={{ background: 'rgba(253,230,138,0.22)' }} />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full blur-2xl z-0" style={{ background: 'rgba(192,132,252,0.12)' }} />

        <div className="relative z-10 flex items-center gap-2 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[rgba(252,231,243,1)] flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[17px] font-extrabold text-foreground leading-none">联系我们</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">随时为小公主预约魔法彩绘</p>
          </div>
        </div>

        <div className="relative z-10 flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-lg scale-105" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(192,132,252,0.2))' }} />
            <div className="relative bg-card rounded-3xl p-4 border border-border shadow-custom">
              <div
                className="w-[148px] h-[148px] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border"
                style={{ background: 'rgba(252,240,255,0.6)' }}
              >
                <div className="flex flex-wrap gap-[2px] mb-2" style={{ width: '84px' }}>
                  {Array.from({ length: 144 }).map((_, i) => {
                    const row = Math.floor(i / 12);
                    const col = i % 12;
                    const isCornerBlock = (row < 3 && col < 3) || (row < 3 && col >= 9) || (row >= 9 && col < 3);
                    const isFilled = isCornerBlock || (Math.sin(i * 1.7) > 0.1);
                    return (
                      <div
                        key={i}
                        className="rounded-[1px]"
                        style={{ width: '6px', height: '6px', background: isFilled ? 'rgba(192,132,252,1)' : 'rgba(248,240,255,1)' }}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] font-semibold text-secondary">微信扫码联系</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground font-medium">或直接联系</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="relative z-10 flex flex-col gap-2.5">
          <a
            href="tel:13800008888"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[rgba(252,210,232,1)] transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,240,248,0.7)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,1), rgba(251,113,133,1))', boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }}>
              <PhoneCall size={17} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground mb-0.5">预约电话</p>
              <p className="text-[15px] font-extrabold text-foreground tracking-wide">138-0000-8888</p>
            </div>
            <span className="text-[11px] text-primary font-semibold flex-shrink-0">立即拨打</span>
          </a>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[rgba(220,200,252,1)]" style={{ background: 'rgba(248,240,255,0.7)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(192,132,252,1), rgba(167,139,250,1))', boxShadow: '0 4px 12px rgba(192,132,252,0.3)' }}>
              <MessageCircle size={17} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground mb-0.5">微信号</p>
              <p className="text-[15px] font-extrabold text-foreground">MagicPaint_Kids</p>
            </div>
            <span className="text-[11px] text-secondary font-semibold flex-shrink-0">扫码添加</span>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[rgba(200,230,255,1)]" style={{ background: 'rgba(235,245,255,0.7)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(96,165,250,1), rgba(59,130,246,1))', boxShadow: '0 4px 12px rgba(96,165,250,0.3)' }}>
              <MapPin size={17} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground mb-0.5">门店地址</p>
              <p className="text-[13px] font-bold text-foreground">魔法城堡购物中心 2F</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5">
          <Clock size={12} className="text-muted-foreground" />
          <p className="text-[11px] text-muted-foreground">营业时间：每日 10:00 - 20:00</p>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
