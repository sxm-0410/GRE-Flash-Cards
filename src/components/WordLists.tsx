import React, { useState } from 'react';
import { MOCK_WORDS } from '../mockData';
import { Flashcard } from './Flashcard';
import { ArrowLeft, ArrowRight, Grid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WordLists: React.FC = () => {
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    if (currentIndex < MOCK_WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(MOCK_WORDS.length - 1); // Loop back to end
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Word Lists</h2>
          <p className="text-gray-500">Master all {MOCK_WORDS.length} foundational words</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('flashcard')}
            className={`p-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
              viewMode === 'flashcard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutList size={18} />
            <span>Flashcards</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Grid size={18} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {viewMode === 'flashcard' ? (
          <motion.div
            key="flashcard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="text-center">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                  Word {currentIndex + 1} of {MOCK_WORDS.length}
                </span>
              </div>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                <ArrowRight size={24} />
              </button>
            </div>

            <div className="relative h-[400px] overflow-hidden">
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
                    word={MOCK_WORDS[currentIndex]}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-center text-gray-400 text-sm italic">
              Use arrows to browse or click the card to reveal details.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MOCK_WORDS.map((word) => (
              <div key={word.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">{word.word}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-50 text-gray-500 rounded uppercase tracking-wider">
                    {word.partOfSpeech}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{word.definition}</p>
                <div className="flex items-center text-xs text-indigo-600 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
