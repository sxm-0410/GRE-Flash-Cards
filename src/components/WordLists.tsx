import React, { useState } from 'react';
import { useWordLists } from '../hooks/useWordLists';
import type { WordList } from '../hooks/useWordLists';
import { useWords } from '../hooks/useWords';
import { Flashcard } from './Flashcard';
import { ArrowLeft, ArrowRight, Grid, LayoutList, ChevronRight, Loader2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '../types';

export const WordLists: React.FC = () => {
  const [selectedList, setSelectedList] = useState<WordList | null>(null);
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [detailedWord, setDetailedWord] = useState<Word | null>(null);

  const { lists, loading: listsLoading, error: listsError } = useWordLists();
  const { words, loading: wordsLoading, error: wordsError } = useWords(selectedList?.id);

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(words.length - 1);
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

  if (listsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading vocabulary lists...</p>
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

  // --- VIEW 1: LIST SELECTION ---
  if (!selectedList) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Vocabulary Lists</h2>
          <p className="text-gray-600 text-lg">Select a curated set of words to start mastering</p>
        </div>

        {lists.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-10 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <p className="text-amber-800 font-bold text-lg mb-2">No lists found in database</p>
            <p className="text-amber-700">Please make sure you have run the <code className="bg-amber-100 px-1 rounded text-sm">seed_data.sql</code> script in your Supabase SQL Editor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lists.map((list) => (
              <motion.div 
                key={list.id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedList(list);
                  setCurrentIndex(0);
                }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      list.difficulty === 'Foundational' ? 'bg-green-100 text-green-700' :
                      list.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {list.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{list.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm font-medium">
                    <LayoutList size={14} className="mr-1.5" />
                    {list.word_count} Words
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: PRACTICE SESSION ---
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Detail Overlay */}
      <AnimatePresence>
        {detailedWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setDetailedWord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setDetailedWord(null)}
                className="absolute -top-12 right-0 text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center space-x-2 font-bold"
              >
                <span>Close</span>
                <X size={24} />
              </button>
              <Flashcard 
                word={detailedWord} 
                isFlipped={true} 
                onFlip={() => {}} 
                hideFlipInstructions={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSelectedList(null)}
            className="p-3 bg-white shadow-sm border border-gray-200 hover:bg-gray-50 rounded-full transition-colors text-gray-500"
            title="Back to lists"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{selectedList.name}</h2>
            <div className="flex items-center space-x-3 mt-1">
               <span className="text-gray-500 font-medium">{wordsLoading ? 'Loading words...' : `${words.length} Words`}</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full" />
               <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{selectedList.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode('flashcard')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-bold transition-all ${
              viewMode === 'flashcard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutList size={16} />
            <span>Study</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-bold transition-all ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Grid size={16} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {wordsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500">Fetching words...</p>
        </div>
      ) : wordsError ? (
        <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-100">
           <p className="text-red-600 font-bold">{wordsError}</p>
        </div>
      ) : words.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
          <p className="text-gray-400 font-bold text-xl mb-2">This list is currently empty</p>
          <p className="text-gray-400">Try selecting another list or seeding the data again.</p>
          <button 
            onClick={() => setSelectedList(null)}
            className="mt-6 text-indigo-600 font-bold hover:underline"
          >
            Back to All Lists
          </button>
        </div>
      ) : (
        <AnimatePresence mode='wait'>
          {viewMode === 'flashcard' ? (
            <motion.div
              key="flashcard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between max-w-xl mx-auto">
                <button
                  onClick={handlePrevious}
                  className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95"
                >
                  <ArrowLeft size={24} />
                </button>
                
                <div className="text-center bg-indigo-50 px-4 py-1.5 rounded-full">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    Word {currentIndex + 1} of {words.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95"
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
                    className="w-full absolute inset-0"
                  >
                    <Flashcard
                      word={words[currentIndex]}
                      isFlipped={isFlipped}
                      onFlip={() => setIsFlipped(!isFlipped)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="text-center text-gray-400 text-sm italic animate-pulse">
                Tip: Click the card to reveal definition and examples
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
            >
              {words.map((word) => (
                <motion.div 
                  key={word.id} 
                  whileHover={{ y: -2 }}
                  onClick={() => setDetailedWord(word)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h3 
                      className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors break-words flex-1 min-w-0" 
                      style={{ hyphens: 'auto', WebkitHyphens: 'auto' }}
                      lang="en"
                    >
                      {word.word}
                    </h3>
                    
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 w-[60px]">
                      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider w-full text-center ${
                        word.masteryState === 'Mastered' ? 'bg-green-100 text-green-700' :
                        word.masteryState === 'Learned' ? 'bg-blue-100 text-blue-700' :
                        word.masteryState === 'Familiar' ? 'bg-indigo-100 text-indigo-700' :
                        word.masteryState === 'Seen' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {word.masteryState || 'Unseen'}
                      </span>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors w-full text-center truncate">
                        {word.partOfSpeech}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">{word.definition}</p>
                  <div className="flex items-center text-xs text-indigo-600 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                    View Details <ArrowRight size={14} className="ml-1.5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
