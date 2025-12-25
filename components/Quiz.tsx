
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  chapterTitle: string;
  chapterContent: string;
  onClose: () => void;
}

const Quiz: React.FC<QuizProps> = ({ chapterTitle, chapterContent, onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuizComplete(false);
    setCurrentIndex(0);
    setScore(0);
    const data = await generateQuiz(chapterTitle, chapterContent);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, [chapterTitle]);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Gemini is synthesizing assessment questions...</p>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-[#111] rounded-2xl border border-white/5 shadow-xl">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Award className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-400 mb-6">
          You scored <span className="text-blue-400 font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={fetchQuiz}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-medium border border-white/10"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all font-bold"
          >
            Finish Chapter
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto my-8">
      {/* Progress Bar */}
      <div className="h-1 bg-white/5 w-full">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs">Exit Quiz</button>
        </div>

        <h3 className="text-xl font-semibold text-white mb-8 leading-snug">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let styles = "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ";
            if (showFeedback) {
              if (idx === currentQ.correctIndex) {
                styles += "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
              } else if (idx === selectedAnswer) {
                styles += "bg-red-500/10 border-red-500/50 text-red-400";
              } else {
                styles += "bg-white/5 border-white/5 text-gray-500 opacity-50";
              }
            } else {
              styles += selectedAnswer === idx 
                ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                : "bg-white/5 border-white/5 hover:border-white/20 text-gray-300";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                className={styles}
                disabled={showFeedback}
              >
                <span className="text-sm font-medium">{option}</span>
                {showFeedback && idx === currentQ.correctIndex && <CheckCircle2 className="w-4 h-4" />}
                {showFeedback && idx === selectedAnswer && idx !== currentQ.correctIndex && <XCircle className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Explanation</p>
            <p className="text-sm text-gray-400 leading-relaxed italic">{currentQ.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all"
            >
              {currentIndex === questions.length - 1 ? 'Finish Results' : 'Next Question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
