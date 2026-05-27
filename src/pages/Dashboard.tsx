import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { Trophy, BookOpen, Star, TrendingUp, ArrowRight, Sparkles, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [masteredCount, setMasteredCount] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [masteryData, setMasteryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMasteryInfo, setShowMasteryInfo] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);

  const [recentWords, setRecentWords] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          
          // ... 1-4 remain same ...
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(profileData);

          const today = new Date().toISOString().split('T')[0];
          const { count: challengeCount } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('type', 'daily')
            .gte('created_at', `${today}T00:00:00Z`);
          setChallengeCompleted((challengeCount || 0) > 0);

          const { count: totalMastered } = await supabase
            .from('user_word_states')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('mastery_state', ['Learned', 'Mastered']);
          setMasteredCount(totalMastered || 0);

          const { data: lists } = await supabase.from('word_lists').select('*');
          if (lists) {
            const masteryResults = await Promise.all(lists.map(async (list) => {
              const { count: totalInList } = await supabase
                .from('word_list_items')
                .select('*', { count: 'exact', head: true })
                .eq('list_id', list.id);

              const { data: listWords } = await supabase
                .from('word_list_items')
                .select('word_id')
                .eq('list_id', list.id);
              
              const wordIds = listWords?.map(lw => lw.word_id) || [];
              
              const { count: masteredInList } = await supabase
                .from('user_word_states')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .in('word_id', wordIds)
                .in('mastery_state', ['Learned', 'Mastered']);

              const percentage = totalInList ? Math.round(((masteredInList || 0) / totalInList) * 100) : 0;
              return { name: list.name, percentage, total: totalInList || 0 };
            }));
            setMasteryData(masteryResults);
          }

          // 5. Fetch Actual Recent Words (Up to 50)
          const { data: recentStates } = await supabase
            .from('user_word_states')
            .select('word_id, mastery_state, last_tested_date, times_seen')
            .eq('user_id', user.id)
            .order('last_tested_date', { ascending: false })
            .order('times_seen', { ascending: false })
            .limit(50);

          if (recentStates && recentStates.length > 0) {
            const wordIds = recentStates.map(s => s.word_id);
            const { data: wordsData } = await supabase
              .from('words')
              .select('*')
              .in('id', wordIds);
            
            if (wordsData) {
              // Combine word data with mastery state and sort to match the recent order
              const combinedWords = recentStates.map(state => {
                const word = wordsData.find(w => w.id === state.word_id);
                return { ...word, masteryState: state.mastery_state };
              }).filter(w => w.word); // filter out any potential undefined
              
              setRecentWords(combinedWords);
            }
          }

        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user]);

  const [activeListsCount, setActiveListsCount] = useState(0);
  useEffect(() => {
    if (user) {
      supabase
        .from('user_word_states')
        .select('word_id')
        .eq('user_id', user.id)
        .then(async ({ data: states }) => {
          if (!states || states.length === 0) {
            setActiveListsCount(0);
            return;
          }
          const wordIds = states.map(s => s.word_id);
          const { data: listItems } = await supabase
            .from('word_list_items')
            .select('list_id')
            .in('word_id', wordIds);
          
          const uniqueLists = new Set(listItems?.map(li => li.list_id));
          setActiveListsCount(uniqueLists.size);
        });
    }
  }, [user]);

  const stats = [
    { name: 'Current Streak', value: `${profile?.streak || 0} days`, icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Words Mastered', value: masteredCount.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Total XP', value: (profile?.xp || 0).toLocaleString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Lists', value: activeListsCount.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.first_name ? `${profile.first_name} ${profile.last_name}`.trim() : user?.email?.split('@')[0] || 'Student'}!
        </h2>
        <p className="text-gray-600">
          You're on a roll. Keep up the daily discipline.
        </p>
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
          <div 
            className={`rounded-2xl p-8 text-white relative overflow-hidden group ${challengeCompleted ? 'bg-green-600' : 'bg-indigo-600 cursor-pointer'}`}
            onClick={() => !challengeCompleted && navigate('/challenge')}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Daily Challenge</h3>
              <p className="mb-6 opacity-90 max-w-sm">
                {challengeCompleted 
                  ? "You have already attempted today's challenge, check again tomorrow for more!" 
                  : "Test your knowledge with today's MCQ challenge and boost your streak!"}
              </p>
              {challengeCompleted ? (
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-2 rounded-full font-bold inline-flex items-center">
                  Completed for today! ✨
                </div>
              ) : (
                <button 
                  className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors flex items-center"
                >
                  Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
            {challengeCompleted ? (
              <Sparkles className="absolute right-[-20px] bottom-[-20px] h-48 w-48 opacity-20 rotate-12" />
            ) : (
              <Trophy className="absolute right-[-20px] bottom-[-20px] h-48 w-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Words</h3>
              {recentWords.length > 0 && (
                <button onClick={() => setShowAllRecent(true)} className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
              )}
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentWords.length > 0 ? (
                recentWords.slice(0, 5).map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 group gap-3 overflow-hidden">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <p className="font-bold text-gray-900 truncate">{word.word}</p>
                        <p className="text-xs text-gray-400 italic truncate">{word.partOfSpeech}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{word.definition}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider min-w-[60px] text-center ${
                        word.masteryState === 'Mastered' ? 'bg-green-100 text-green-700' :
                        word.masteryState === 'Learned' ? 'bg-blue-100 text-blue-700' :
                        word.masteryState === 'Familiar' ? 'bg-indigo-100 text-indigo-700' :
                        word.masteryState === 'Seen' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {word.masteryState || 'Unseen'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic mb-2">No words studied yet.</p>
                  <p className="text-xs text-indigo-600 font-medium">Complete a daily challenge!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
            <div className="flex items-center space-x-2 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Mastery Progress</h3>
              <button 
                onClick={() => setShowMasteryInfo(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="How does mastery work?"
              >
                <Info size={18} />
              </button>
            </div>

            <AnimatePresence>
              {showMasteryInfo && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 z-10 bg-white rounded-xl shadow-xl border border-gray-200 p-6 flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center">
                      <Star size={16} className="text-yellow-500 mr-2" /> How Mastery Works
                    </h4>
                    <button onClick={() => setShowMasteryInfo(false)} className="text-gray-400 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3 overflow-y-auto text-sm text-gray-600 custom-scrollbar pr-2 flex-1 pb-2">
                    <p><strong className="text-gray-900">Unseen (0%):</strong> The default state.</p>
                    <p><strong className="text-gray-900">Seen (0%):</strong> You viewed the flashcard but haven't been tested on it or you got it wrong.</p>
                    <p><strong className="text-gray-900">Familiar (0%):</strong> You got it right in a quiz once.</p>
                    <p className="bg-green-50 p-2 rounded border border-green-100 text-green-800">
                      <strong className="text-green-900">Learned (Counts):</strong> You got it right in a quiz twice on <em>different days</em>.
                    </p>
                    <p className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800">
                      <strong className="text-indigo-900">Mastered (Counts):</strong> You got it right in a quiz three times across <em>different days</em>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              {loading ? (

                 <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                        <div className="h-2 bg-gray-100 rounded-full w-full" />
                      </div>
                    ))}
                 </div>
              ) : masteryData.length > 0 ? (
                masteryData.map((data, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">{data.name}</span>
                      <span className="font-bold text-indigo-600">{data.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm italic">No data yet.</p>
              )}
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

      {/* View All Recent Words Modal */}
      <AnimatePresence>
        {showAllRecent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setShowAllRecent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Words</h2>
                  <p className="text-gray-500 text-sm mt-1">Your last {recentWords.length} practiced words.</p>
                </div>
                <button 
                  onClick={() => setShowAllRecent(false)} 
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {recentWords.map(word => (
                   <div key={word.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors gap-4 group">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-baseline space-x-2">
                         <p className="font-bold text-gray-900 text-lg truncate">{word.word}</p>
                         <p className="text-xs text-gray-500 italic truncate">{word.partOfSpeech}</p>
                       </div>
                       <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">{word.definition}</p>
                     </div>
                     <div className="flex-shrink-0">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider min-w-[60px] text-center ${
                          word.masteryState === 'Mastered' ? 'bg-green-100 text-green-700' :
                          word.masteryState === 'Learned' ? 'bg-blue-100 text-blue-700' :
                          word.masteryState === 'Familiar' ? 'bg-indigo-100 text-indigo-700' :
                          word.masteryState === 'Seen' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {word.masteryState || 'Unseen'}
                        </span>
                     </div>
                   </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
