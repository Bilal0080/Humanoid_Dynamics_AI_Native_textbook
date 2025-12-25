
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { getAIExplanation } from '../services/geminiService';
import { Message } from '../types';

interface AIAssistantProps {
  currentTopic: string;
  context: string;
  externalRequest?: { type: string; prompt: string } | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentTopic, context, externalRequest }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your AI Robotics Professor. I've indexed Chapter "${currentTopic}". Ask me anything about the math, mechanics, or implementation!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (externalRequest) {
      handleSend(externalRequest.prompt);
    }
  }, [externalRequest]);

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getAIExplanation(currentTopic, context, textToSend);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (content: string, msgIndex: number) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
        const lang = part.match(/```(\w+)/)?.[1] || 'code';
        return (
          <div key={i} className="my-3 relative group animate-message-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between px-3 py-1 bg-[#1a1a1a] rounded-t-lg border-x border-t border-white/10">
              <span className="text-[10px] font-mono text-gray-500 uppercase">{lang}</span>
              <button 
                onClick={() => copyToClipboard(code, msgIndex + i)}
                className="text-gray-500 hover:text-white transition-all transform active:scale-90"
              >
                {copiedId === msgIndex + i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded-b-lg border border-white/10 overflow-x-auto font-mono text-xs text-blue-300 leading-relaxed shadow-inner">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      return <div key={i} className="whitespace-pre-wrap">{part}</div>;
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 assistant-container z-50 flex flex-col ${
      isExpanded ? 'w-[550px] h-[700px]' : 'w-[400px] h-[450px]'
    } bg-[#0d0d0d] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden ${isLoading ? 'animate-glow-loop' : ''}`}>
      
      {/* Header */}
      <div className={`p-4 transition-colors duration-500 ${isLoading ? 'bg-blue-600/30' : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20'} border-b border-white/10 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all duration-500 ${isLoading ? 'bg-blue-400 text-black shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'bg-blue-500/20 text-blue-400'}`}>
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">AI Robotics Professor</h3>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-ping' : 'bg-emerald-500 animate-soft-pulse'}`} />
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                {isLoading ? 'Computing Intelligence...' : 'Gemini 3 Pro Online'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all transform active:scale-95 shadow-sm"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]/50 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 hover:scale-110 shadow-lg ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-[#1a1a1a]'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-400" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed transition-all duration-300 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600/15 text-blue-50 border border-blue-500/30' 
                  : 'bg-white/5 text-gray-300 border border-white/10 backdrop-blur-sm'
              }`}>
                {renderContent(msg.content, i)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-message-in">
            <div className="flex gap-3 max-w-[85%]">
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-md">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 text-gray-500 text-sm italic border border-white/10 animate-soft-pulse">
                Synthesizing derivation and complex implementations...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a deep technical question..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/[0.08] resize-none h-14 pr-12 transition-all duration-300 shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-90 hover:scale-105 shadow-xl shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-600 mt-2 font-mono uppercase tracking-tighter opacity-70">
          Enter to send // Shift+Enter for newline
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
