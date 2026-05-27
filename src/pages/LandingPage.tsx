import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Menu Bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50">
        <div className="flex items-center space-x-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">GREedy Words</span>
        </div>
        <div>
          {user ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors text-sm"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-600 font-bold hover:text-gray-900 transition-colors text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors text-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master GRE Vocabulary <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Without the Grind.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          GREedy Words is a smart flashcard platform designed for dedicated test-takers. Build daily habits, track your mastery, and learn words through active recall rather than passive reading.
        </p>
        
        {!user && (
          <button 
            onClick={() => navigate('/auth')}
            className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl flex items-center shadow-lg"
          >
            Start Learning for Free <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="text-indigo-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Challenges</h3>
            <p className="text-gray-600 leading-relaxed">
              Build discipline with our 20-word daily MCQ challenge. Protect your streak and make learning a consistent habit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="text-purple-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Curated Lists</h3>
            <p className="text-gray-600 leading-relaxed">
              Study targeted vocabulary sets like High-Frequency 500 or Advanced Antonyms at your own pace.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Star className="text-orange-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Spaced Repetition</h3>
            <p className="text-gray-600 leading-relaxed">
              Our algorithm ensures you review difficult words more frequently until you've truly mastered them.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
