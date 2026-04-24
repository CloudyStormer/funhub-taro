import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div data-cmp="SearchBar" className="px-4 pt-2 pb-4">
      <div className="flex items-center bg-[rgba(255,255,255,0.8)] backdrop-blur-sm rounded-full p-1.5 shadow-[0_2px_12px_rgba(16,185,129,0.06)] border border-[rgba(255,255,255,1)]">
        <div className="pl-3 pr-2 text-[rgba(113,142,126,1)]">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="搜索话题、圈子、活动..."
          className="flex-1 bg-transparent text-[14px] text-[rgba(22,51,38,1)] placeholder-[rgba(148,179,161,1)] outline-none"
        />
        <button className="bg-gradient-to-r from-[rgba(52,211,153,1)] to-[rgba(16,185,129,1)] text-[rgba(255,255,255,1)] px-5 py-1.5 rounded-full text-[13px] font-medium shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:opacity-90 transition-opacity">
          搜索
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
