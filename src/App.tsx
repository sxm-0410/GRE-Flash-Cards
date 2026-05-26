import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DailyChallenge } from './components/DailyChallenge';
import { WordLists } from './components/WordLists';
import { MOCK_WORDS } from './mockData';
import { Trophy, BookOpen, Star, TrendingUp, ArrowRight } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const stats = [
    { name: 'Current Streak', value: '5 days', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Words Mastered', value: '124', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Total XP', value: '1,250', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Lists', value: '3', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Student!</h2>
        <p className="text-gray-600">You're on a roll. Keep up the daily discipline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/challenge')}>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Daily Challenge</h3>
              <p className="mb-6 opacity-90 max-w-sm">Test your knowledge with today's MCQ challenge and boost your streak!</p>
              <button 
                className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors flex items-center"
              >
                Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            <Trophy className="absolute right-[-20px] bottom-[-20px] h-48 w-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Words</h3>
              <button onClick={() => navigate('/lists')} className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {MOCK_WORDS.slice(0, 5).map((word) => (
                <div key={word.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <div>
                    <p className="font-bold text-gray-900">{word.word}</p>
                    <p className="text-sm text-gray-500 italic">{word.partOfSpeech}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    word.difficulty === 'Foundational' ? 'bg-green-100 text-green-700' :
                    word.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {word.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mastery Progress</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">High-Frequency 500</span>
                  <span className="font-bold text-indigo-600">45%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Barron's 333</span>
                  <span className="font-bold text-indigo-600">12%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
            <h3 className="text-indigo-900 font-bold mb-2">Pro Tip</h3>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Research shows that active recall through quizzes is 2x more effective than passive reading. Try the Daily Challenge!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/challenge" element={<DailyChallenge />} />
          <Route path="/lists" element={<WordLists />} />
          <Route path="/admin" element={<div className="text-center py-20 text-gray-500 italic">Admin Dashboard coming soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
