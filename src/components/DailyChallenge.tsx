import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_WORDS } from '../mockData';
import { Flashcard } from './Flashcard';
import { Trophy, ArrowLeft, ArrowRight, RotateCcw, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  wordId: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
}

export const DailyChallenge: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const challengeWords = useMemo(() => MOCK_WORDS.slice(0, 20), []);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const generatedQuestions = challengeWords.map((word) => {
      const distractors = MOCK_WORDS
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
  }, [challengeWords]);

  const currentWord = challengeWords[currentIndex];
  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (currentQuestion.userAnswer !== null) return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = option;
    setQuestions(updatedQuestions);
    setIsFlipped(true);
  };

  const handleNext = () => {
    if (currentIndex < challengeWords.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
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

  if (questions.length === 0) return null;

  if (isFinished) {
    const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
    const incorrectCount = questions.length - correctCount;

    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-yellow-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenge Complete!</h2>
          <p className="text-gray-600 mb-8">You've completed the MCQ challenge for today.</p>
          
          <div className="grid grid-cols-2 gap-6 mb-10">
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
            <Link to="/" className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Back to Dashboard
            </Link>
            <button 
              onClick={() => {
                resetChallenge();
                setIsFinished(false);
              }}
              className="flex items-center justify-center px-8 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const resetChallenge = () => {
    setCurrentIndex(0);
    setDirection(0);
    setIsFlipped(false);
    const regened = challengeWords.map((word) => {
      const distractors = MOCK_WORDS
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(w => w.definition);
      const options = [word.definition, ...distractors].sort(() => 0.5 - Math.random());
      return { wordId: word.id, options, correctAnswer: word.definition, userAnswer: null };
    });
    setQuestions(regened);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Daily Challenge</p>
          <div className="flex items-center space-x-2">
            <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
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
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
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
            className="space-y-4"
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentQuestion.userAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const hasAnswered = currentQuestion.userAnswer !== null;
              
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";
              
              if (!hasAnswered) {
                buttonClass += "bg-white border-gray-100 hover:border-indigo-500 hover:shadow-md text-gray-700";
              } else if (isCorrect) {
                buttonClass += "bg-green-50 border-green-500 text-green-700 font-medium";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-50 border-red-500 text-red-700 font-medium";
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
                  <span className="flex-1 pr-4">{option}</span>
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
          className="mt-8 flex justify-center animate-bounce"
        >
          <button 
            onClick={handleNext}
            className="flex items-center space-x-2 text-indigo-600 font-bold"
          >
            <span>{currentIndex === challengeWords.length - 1 ? 'Finish Challenge' : 'Next Word'}</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
