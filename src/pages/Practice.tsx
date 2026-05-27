import React, { useState, useEffect, useMemo } from 'react';
import { useWordLists } from '../hooks/useWordLists';
import { useWords } from '../hooks/useWords';
import { Flashcard } from '../components/Flashcard';
import { Trophy, ArrowLeft, ArrowRight, RotateCcw, Check, X, Loader2, AlertCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

interface Question {
  wordId: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
}

export const Practice: React.FC = () => {
  const { user } = useAuth();
  const { lists, loading: listsLoading, error: listsError } = useWordLists();
  
  // Selection State
  const [selectedListId, setSelectedListId] = useState<string | 'all' | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);

  // Fetch words based on selection
  // Note: If 'all' is selected, useWords(undefined) fetches all words.
  const { words: activeWords, loading: wordsLoading } = useWords(selectedListId === 'all' ? undefined : (selectedListId || undefined));

  // Practice State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  // Generate up to 20 random words for the practice session
  const practiceWords = useMemo(() => {
    if (!activeWords || activeWords.length === 0 || !isPracticing) return [];
    return [...activeWords].sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [activeWords, isPracticing]);

  useEffect(() => {
    if (practiceWords.length > 0 && isPracticing) {
      const generatedQuestions = practiceWords.map((word) => {
        const distractors = activeWords
          .filter(w => w.id !== word.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map(w => w.definition);
        
        const options = [word.definition, ...distractors].sort(() => 0.5 - Math.random());
        
        return {
          wordId: word.id,
          options,
          correctAnswer: word.definition,
          userAnswer: null
        };
      });
      setQuestions(generatedQuestions);
    }
  }, [practiceWords, activeWords, isPracticing]);

  const currentWord = practiceWords[currentIndex];
  const currentQuestion = questions[currentIndex];

  const handleStartPractice = (listId: string | 'all') => {
    setSelectedListId(listId);
    setIsPracticing(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setQuestions([]);
  };

  const resetPractice = () => {
    setIsPracticing(false);
    setSelectedListId(null);
    setIsFinished(false);
    setCurrentIndex(0);
    setQuestions([]);
  };

  const handleOptionClick = (option: string) => {
    if (currentQuestion.userAnswer !== null) return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = option;
    setQuestions(updatedQuestions);
    setIsFlipped(true);
  };

  const handleNext = async () => {
    if (currentIndex < practiceWords.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      await saveSession();
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveSession = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
      
      // Record as a 'quiz' session so it doesn't affect the daily challenge limit
      await supabase.from('sessions').insert({
        user_id: user.id,
        type: 'quiz',
        score: correctCount,
        total_questions: questions.length
      });

      // Update XP only (do not update streak or last_active_date for practice)
      const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
      
      await supabase.from('profiles').update({
        xp: (profile?.xp || 0) + (correctCount * 5) // Slightly less XP for practice
      }).eq('id', user.id);

      // Mastery Algorithm Update
      const wordIds = questions.map(q => q.wordId);
      const { data: existingStates } = await supabase
        .from('user_word_states')
        .select('*')
        .eq('user_id', user.id)
        .in('word_id', wordIds);

      const stateMap = new Map();
      if (existingStates) {
        existingStates.forEach(s => stateMap.set(s.word_id, s));
      }

      const today = new Date().toISOString().split('T')[0];
      const wordUpserts = questions.map(q => {
        const isCorrect = q.userAnswer === q.correctAnswer;
        const existing = stateMap.get(q.wordId);
        
        let state = existing ? existing.mastery_state : 'Unseen';
        const lastTested = existing ? existing.last_tested_date : null;
        
        if (isCorrect) {
          if (state === 'Unseen' || state === 'Seen') {
            state = 'Familiar';
          } else if (state === 'Familiar' && lastTested !== today) {
            state = 'Learned';
          } else if (state === 'Learned' && lastTested !== today) {
            state = 'Mastered';
          }
        } else {
          state = 'Seen'; 
        }

        return {
          user_id: user.id,
          word_id: q.wordId,
          mastery_state: state,
          correct_count: (existing?.correct_count || 0) + (isCorrect ? 1 : 0),
          incorrect_count: (existing?.incorrect_count || 0) + (isCorrect ? 0 : 1),
          last_tested_date: today,
          times_seen: (existing?.times_seen || 0) + 1
        };
      });

      await supabase.from('user_word_states').upsert(wordUpserts);

    } catch (err) {
      console.error('Error saving practice session:', err);
    } finally {
      setSaving(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 }),
  };

  // --- SELECTION VIEW ---
  if (!isPracticing) {
    if (listsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading practice options...</p>
        </div>
      );
    }

    if (listsError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load lists</h3>
          <p className="text-gray-600 max-w-sm">{listsError}</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Practice Area</h2>
          <p className="text-gray-600 text-lg">Select a list to start an unlimited practice session. Practice earns you 5 XP per correct answer but does not affect your daily streak.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Lists Option */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => handleStartPractice('all')}
            className="bg-indigo-600 p-8 rounded-3xl shadow-md border border-indigo-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between text-white"
          >
             <div>
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                   <Play className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Global Practice</h3>
                <p className="text-indigo-100 mb-6">A mixed quiz drawing from every word available in the database.</p>
             </div>
             <div className="flex items-center text-sm font-bold tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity">
                Start Global Quiz <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </div>
          </motion.div>

          {lists.map((list) => (
            <motion.div 
              key={list.id}
              whileHover={{ y: -4 }}
              onClick={() => handleStartPractice(list.id)}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    list.difficulty === 'Foundational' ? 'bg-green-100 text-green-700' :
                    list.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {list.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{list.name}</h3>
                <p className="text-sm text-gray-500 mb-6">Focus your practice specifically on the {list.word_count} words in this curated list.</p>
              </div>
              <div className="flex items-center text-indigo-600 text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Start Practice <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // --- PRACTICE VIEW ---
  if (wordsLoading || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing practice session...</p>
      </div>
    );
  }

  if (isFinished) {
    const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
    const incorrectCount = questions.length - correctCount;

    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-indigo-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Practice Complete!</h2>
          <p className="text-gray-600 mb-8">You earned +{correctCount * 5} XP from this session.</p>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <p className="text-green-600 font-bold text-3xl mb-1">{correctCount}</p>
              <p className="text-green-700 text-sm font-medium uppercase tracking-wider">Correct</p>
            </div>
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <p className="text-red-600 font-bold text-3xl mb-1">{incorrectCount}</p>
              <p className="text-red-700 text-sm font-medium uppercase tracking-wider">Incorrect</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={resetPractice}
              className="flex items-center justify-center px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Back to Selection
            </button>
            <button 
              onClick={() => handleStartPractice(selectedListId!)}
              className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Practice Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Practice Mode</p>
          <div className="flex items-center space-x-3">
            <div className="w-32 md:w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-2 rounded-full" 
                initial={false}
                animate={{ width: `${((currentIndex + 1) / practiceWords.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{currentIndex + 1}/{practiceWords.length}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button
             onClick={resetPractice}
             className="px-4 py-2 rounded-lg font-medium text-gray-500 hover:bg-gray-50 text-sm hidden md:block border border-transparent hover:border-gray-200"
           >
             Exit
           </button>
           <button
             onClick={handleNext}
             className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
           >
             {currentIndex === practiceWords.length - 1 ? 'Finish' : 'Next'}
             <ArrowRight className="ml-2 h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="relative py-4 h-[440px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode='popLayout'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <Flashcard 
              word={currentWord} 
              isFlipped={isFlipped} 
              onFlip={() => setIsFlipped(!isFlipped)} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        layout
        className="mt-12 space-y-4 max-w-xl mx-auto"
      >
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Select the correct definition</p>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentQuestion.userAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const hasAnswered = currentQuestion.userAnswer !== null;
              
              let buttonClass = "w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 flex items-center justify-between h-auto ";
              
              if (!hasAnswered) {
                buttonClass += "bg-white border-gray-100 hover:border-indigo-500 hover:shadow-md text-gray-700";
              } else if (isCorrect) {
                buttonClass += "bg-green-50 border-green-500 text-green-700 font-bold";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-50 border-red-500 text-red-700 font-bold";
              } else {
                buttonClass += "bg-white border-gray-100 text-gray-400 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={hasAnswered}
                  className={buttonClass}
                >
                  <span className="flex-1 pr-4 leading-relaxed">{option}</span>
                  {hasAnswered && isCorrect && <Check className="h-5 w-5 text-green-600 flex-shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600 flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {currentQuestion.userAnswer !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-center"
        >
          <button 
            onClick={handleNext}
            disabled={saving}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                <span>{currentIndex === practiceWords.length - 1 ? 'Finish Practice' : 'Next Word'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};
