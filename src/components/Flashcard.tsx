import React from 'react';
import type { Word } from '../types';
import { RotateCw } from 'lucide-react';

interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  hideFlipInstructions?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ word, isFlipped, onFlip, hideFlipInstructions }) => {
  return (
    <div className="w-full max-w-md mx-auto h-96 perspective-1000 group">
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-2 border-indigo-100 flex flex-col items-center justify-center p-8">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-4">
            {word.partOfSpeech}
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{word.word}</h2>
          {!hideFlipInstructions && (
            <div className="mt-8 flex items-center text-gray-400 text-sm animate-pulse">
              <RotateCw size={16} className="mr-2" />
              Click to reveal definition
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl border-2 border-indigo-500 flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">{word.word}</h2>
            <span className="text-sm text-gray-500 italic">{word.partOfSpeech}</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Definition</h3>
              <p className="text-gray-700 leading-relaxed">{word.definition}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Example</h3>
              <p className="text-gray-700 italic">"{word.example}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Synonym</h3>
                <p className="text-gray-700 font-medium">{word.synonym}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Antonym</h3>
                <p className="text-gray-700 font-medium">{word.antonym}</p>
              </div>
            </div>
          </div>

          {!hideFlipInstructions && (
            <div className="mt-auto pt-6 flex justify-center text-gray-400 text-sm">
              Click to flip back
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
