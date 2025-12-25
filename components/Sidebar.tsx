
import React from 'react';
import { TEXTBOOK_CHAPTERS } from '../constants';
import { BookOpen, ChevronRight, Cpu, Layers, Activity, Eye, Zap } from 'lucide-react';

interface SidebarProps {
  activeChapterId: string;
  onChapterSelect: (id: string) => void;
}

const getIcon = (id: string) => {
  switch (id) {
    case 'intro': return <Layers className="w-4 h-4" />;
    case 'kinematics': return <Cpu className="w-4 h-4" />;
    case 'dynamics': return <Activity className="w-4 h-4" />;
    case 'sensing': return <Eye className="w-4 h-4" />;
    case 'learning': return <Zap className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeChapterId, onChapterSelect }) => {
  return (
    <div className="w-72 h-full bg-[#0d0d0d] border-r border-white/10 flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Humanoid Core
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">AI-Native Courseware</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="px-2 mb-4">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Chapters</p>
        </div>
        {TEXTBOOK_CHAPTERS.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left group ${
              activeChapterId === chapter.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <div className={`p-2 rounded-md ${activeChapterId === chapter.id ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
              {getIcon(chapter.id)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{chapter.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{chapter.description}</p>
            </div>
            {activeChapterId === chapter.id && <ChevronRight className="w-4 h-4 shrink-0" />}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-emerald-200">AI Tutor Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
