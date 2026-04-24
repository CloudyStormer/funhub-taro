import React, { useState } from 'react';
import { CalendarHeart, CheckCircle2, ChevronDown } from 'lucide-react';

const designOptions = ['梦幻蝴蝶', '星空独角兽', '百花仙子', '粉色精灵', '到店沟通'];

const BookingForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [design, setDesign] = useState('梦幻蝴蝶');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', { name, phone, date, design });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setDate('');
      setDesign('梦幻蝴蝶');
    }, 3000);
  };

  const inputClass =
    `w-full bg-muted border border-border rounded-2xl px-4 py-3 text-[14px] text-foreground outline-none transition-all placeholder-[rgba(180,150,180,1)] focus:border-primary`;

  return (
    <div data-cmp="BookingForm" id="booking-section" className="px-4 pb-4 pt-2">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-custom relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl z-0" style={{ background: 'rgba(253,230,138,0.22)' }} />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-3xl z-0" style={{ background: 'rgba(192,132,252,0.12)' }} />

        <div className="relative z-10 flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[rgba(252,231,243,1)] flex items-center justify-center">
            <CalendarHeart size={22} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[17px] font-extrabold text-foreground leading-none">在线预约</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">提前预约，为宝贝保留专属时间</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="relative z-10 py-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(209,250,229,0.6)' }}>
              <CheckCircle2 size={36} style={{ color: 'rgba(52,211,153,1)' }} />
            </div>
            <h3 className="text-[17px] font-extrabold text-foreground">预约提交成功！</h3>
            <p className="text-[13px] text-muted-foreground mt-2 text-center leading-relaxed">
              我们会尽快联系您确认细节<br />期待与小公主的见面 ✨
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3.5">
            <div>
              <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 ml-1">宝宝昵称</label>
              <input type="text" required placeholder="例如：小果果" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 ml-1">联系电话</label>
              <input type="tel" required placeholder="您的手机号码" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 ml-1">预约日期</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              </div>
              <div className="flex-1">
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1.5 ml-1">心仪图案</label>
                <div className="relative">
                  <select value={design} onChange={(e) => setDesign(e.target.value)} className={inputClass + ' appearance-none pr-8'}>
                    {designOptions.map((opt) => (<option key={opt}>{opt}</option>))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-1 py-3.5 rounded-2xl font-extrabold text-[15px] text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-[0_6px_20px_rgba(236,72,153,0.28)]"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,1), rgba(192,132,252,1))' }}
            >
              提交预约 ✨
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
