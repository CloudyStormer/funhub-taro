import React from 'react';
import { Sparkles } from 'lucide-react';

const ContactFooter = () => {
  return (
    <div data-cmp="ContactFooter" className="px-5 pb-10 pt-2 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="flex-1 h-px bg-border" />
        <Sparkles size={14} className="text-primary" style={{ opacity: 0.5 }} />
        <div className="flex-1 h-px bg-border" />
      </div>
      <p className="text-[11px] text-muted-foreground">
        © 2024 Magical Face Painting. All rights reserved.
      </p>
      <p className="text-[10px] text-muted-foreground mt-1" style={{ opacity: 0.6 }}>
        让每一个孩子都成为小公主 ✨
      </p>
    </div>
  );
};

export default ContactFooter;
