
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RoboticsVisualizer from './components/RoboticsVisualizer';
import AIAssistant from './components/AIAssistant';
import Quiz from './components/Quiz';
import { TEXTBOOK_CHAPTERS } from './constants';
import { Brain, Calculator, Code, FlaskConical, Github, PlayCircle, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState(TEXTBOOK_CHAPTERS[0].id);
  const [showQuiz, setShowQuiz] = useState(false);
  const [pendingAIRequest, setPendingAIRequest] = useState<{type: string, prompt: string} | null>(null);
  
  const activeChapter = TEXTBOOK_CHAPTERS.find(c => c.id === activeChapterId) || TEXTBOOK_CHAPTERS[0];

  const handleChapterChange = (id: string) => {
    setActiveChapterId(id);
    setShowQuiz(false);
    setPendingAIRequest(null);
  };

  const triggerAIAction = (type: 'summary' | 'math' | 'code') => {
    let prompt = '';
    switch(type) {
      case 'summary':
        prompt = `Please provide a concise high-level summary of the key takeaways from the chapter: "${activeChapter.title}". Focus on practical implications for humanoid control.`;
        break;
      case 'math':
        prompt = `Perform a deep mathematical derivation for one of the core algorithms mentioned in "${activeChapter.title}". Please use LaTeX and show every step clearly.`;
        break;
      case 'code':
        prompt = `Generate a production-quality Python or C++ snippet that implements a core concept from "${activeChapter.title}" (e.g., a specific controller or kinematic solver). Include comments explaining the implementation details.`;
        break;
    }
    setPendingAIRequest({ type, prompt: `${prompt}\nTimestamp: ${Date.now()}` });
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar 
        activeChapterId={activeChapterId} 
        onChapterSelect={handleChapterChange} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-500">HUMANOID_V4.2.0</span>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
              <FlaskConical className="w-3 h-3" />
              <span>LAB ENVIRONMENT: ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <Github className="w-4 h-4" />
              <span className="text-xs font-medium">Source Code</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Run Simulation
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-8 lg:p-12 xl:p-16">
          <div className="max-w-4xl mx-auto">
            {showQuiz ? (
              <div className="py-12">
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    ← Back to Content
                  </button>
                  <h1 className="text-2xl font-bold text-white">Chapter Assessment</h1>
                </div>
                <Quiz 
                  chapterTitle={activeChapter.title} 
                  chapterContent={activeChapter.content} 
                  onClose={() => setShowQuiz(false)}
                />
              </div>
            ) : (
              <>
                {/* Header Section */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase tracking-widest border border-blue-500/20">
                      Chapter {TEXTBOOK_CHAPTERS.indexOf(activeChapter) + 1}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                    {activeChapter.title.split('. ')[1]}
                  </h1>
                  <p className="text-xl text-gray-400 leading-relaxed font-light">
                    {activeChapter.description}
                  </p>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex flex-wrap gap-3 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                  <button 
                    onClick={() => triggerAIAction('summary')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-gray-300 transition-all border border-white/5 hover:border-white/20"
                  >
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    AI Summary
                  </button>
                  <button 
                    onClick={() => triggerAIAction('math')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-gray-300 transition-all border border-white/5 hover:border-white/20"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    Math Derivation
                  </button>
                  <button 
                    onClick={() => triggerAIAction('code')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-gray-300 transition-all border border-white/5 hover:border-white/20"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    Python Snippet
                  </button>
                  <button 
                    onClick={() => setShowQuiz(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 transition-all border border-emerald-500/20"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Take Chapter Quiz
                  </button>
                </div>

                {/* Main Content */}
                <article className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-8 prose-p:text-lg prose-headings:text-white animate-in fade-in duration-1000 delay-300">
                  <div className="space-y-8">
                    {activeChapter.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Dynamic Visualization Integration */}
                  <div className="animate-in fade-in zoom-in-95 duration-700">
                    {activeChapter.id === 'intro' && (
                      <RoboticsVisualizer type="torque" title="Actuator Power Consumption Over Gait Cycle" />
                    )}
                    {activeChapter.id === 'kinematics' && (
                      <RoboticsVisualizer type="joint" title="7-DoF Arm Joint Space Trajectory" />
                    )}
                    {activeChapter.id === 'dynamics' && (
                      <RoboticsVisualizer type="zmp" title="ZMP Stability Analysis" />
                    )}
                  </div>

                  {/* Specific Topics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {activeChapter.topics.map((topic, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setPendingAIRequest({ type: 'topic', prompt: `Tell me more about ${topic} in the context of ${activeChapter.title}.` })}
                        className="group p-6 bg-[#111] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer shadow-sm hover:shadow-blue-500/10"
                      >
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                          {topic}
                          <span className="text-[10px] text-gray-600 font-mono">0{idx + 1}</span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">Click for AI-assisted mathematical deep dive on this specific submodule.</p>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Footer / Navigation */}
                <div className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center mb-12">
                  <p className="text-xs text-gray-600 font-mono tracking-widest uppercase opacity-50">© 2025 HUMANOID_CORE_PROJECT // STATE_SECURE</p>
                  <div className="flex gap-4">
                    <button className="text-xs text-gray-400 hover:text-white uppercase tracking-widest font-bold transition-colors">Prev Chapter</button>
                    <button className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold transition-colors">Next Chapter</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant 
        currentTopic={activeChapter.title} 
        context={activeChapter.content}
        externalRequest={pendingAIRequest}
      />
    </div>
  );
};

export default App;
