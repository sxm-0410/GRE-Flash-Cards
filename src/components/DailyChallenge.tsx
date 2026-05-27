import React, { useState, useEffect, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { Trophy, ArrowLeft, ArrowRight, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWords } from '../hooks/useWords';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

interface Question {
  wordId: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
}

export const DailyChallenge: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { words: allWords, loading: wordsLoading } = useWords();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [checkingAttempt, setCheckingAttempt] = useState(true);

  // Check if today's challenge is already attempted
  useEffect(() => {
    if (user) {
      const checkAttempt = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const { count } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('type', 'daily')
            .gte('created_at', `${today}T00:00:00Z`);
          
          setAlreadyAttempted((count || 0) > 0);
        } catch (err) {
          console.error('Error checking challenge attempt:', err);
        } finally {
          setCheckingAttempt(false);
        }
      };
      checkAttempt();
    }
  }, [user]);

  // Generate 20 random words for the challenge from the full list
  const challengeWords = useMemo(() => {
    if (!allWords || allWords.length === 0) return [];
    return [...allWords].sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [allWords]);

  useEffect(() => {
    if (challengeWords.length > 0 && !alreadyAttempted) {
      const generatedQuestions = challengeWords.map((word) => {
        const distractors = allWords
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
  }, [challengeWords, allWords, alreadyAttempted]);

  const currentWord = challengeWords[currentIndex];
  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (currentQuestion.userAnswer !== null) return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = option;
    setQuestions(updatedQuestions);
    setIsFlipped(true);
  };

  const handleNext = async () => {
    if (currentIndex < challengeWords.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      await saveSession();
      setIsFinished(true);
    }
  };

  const saveSession = async () => {
    if (!user || alreadyAttempted) return;
    setSaving(true);
    try {
      const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
      
      // 1. Record the session
      const { error: sessionError } = await supabase.from('sessions').insert({
        user_id: user.id,
        type: 'daily',
        score: correctCount,
        total_questions: questions.length
      });

      if (sessionError) {
        console.error('Failed to save session:', sessionError);
        alert('Database Error (Sessions): ' + sessionError.message);
        throw sessionError;
      }

      // 2. Update profile streak/xp
      const { data: profile, error: profileFetchError } = await supabase.from('profiles').select('streak, xp').eq('id', user.id).single();
      
      if (profileFetchError) {
        console.error('Failed to fetch profile:', profileFetchError);
        // Continue anyway, maybe it's the first time
      }
      
      const { error: profileUpdateError } = await supabase.from('profiles').update({
        streak: (profile?.streak || 0) + 1,
        xp: (profile?.xp || 0) + (correctCount * 10),
        last_active_date: new Date().toISOString().split('T')[0]
      }).eq('id', user.id);

      if (profileUpdateError) {
        console.error('Failed to update profile:', profileUpdateError);
        alert('Database Error (Profiles): ' + profileUpdateError.message);
        throw profileUpdateError;
      }

    } catch (err) {
      console.error('Error saving session:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  if (wordsLoading || checkingAttempt || (challengeWords.length > 0 && !alreadyAttempted && questions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing your daily challenge...</p>
      </div>
    );
  }

  if (alreadyAttempted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50/50 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-amber-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Challenge Already Completed</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You have already attempted today's challenge, check again tomorrow for more!
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (challengeWords.length === 0) {
     return (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
           <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-gray-900 mb-2">No words available</h2>
           <p className="text-gray-600 mb-6">Please seed the database with words to start the challenge.</p>
           <Link to="/" className="text-indigo-600 font-bold hover:underline">Back to Dashboard</Link>
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
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-yellow-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenge Complete!</h2>
          <p className="text-gray-600 mb-8">You've completed the MCQ challenge for today.</p>
          
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
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
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Daily Challenge</p>
          <div className="flex items-center space-x-3">
            <div className="w-32 md:w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-2 rounded-full" 
                initial={false}
                animate={{ width: `${((currentIndex + 1) / challengeWords.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{currentIndex + 1}/20</span>
          </div>
        </div>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
        >
          {currentIndex === challengeWords.length - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
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
                <span>{currentIndex === challengeWords.length - 1 ? 'Finish Challenge' : 'Next Word'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};
