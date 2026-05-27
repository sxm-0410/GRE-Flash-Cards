import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useWords } from '../hooks/useWords';
import { supabase } from '../lib/supabase';
import { Trophy, BookOpen, Star, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { words } = useWords();
  const [profile, setProfile] = useState<any>(null);
  const [masteredCount, setMasteredCount] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [masteryData, setMasteryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          
          // 1. Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(profileData);

          // 2. Check if today's challenge is done
          const today = new Date().toISOString().split('T')[0];
          const { count: challengeCount, error: challengeError } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('type', 'daily')
            .gte('created_at', `${today}T00:00:00Z`);
            
          if (challengeError) {
            console.error('Error checking challenge count:', challengeError);
          }
          setChallengeCompleted((challengeCount || 0) > 0);

          // 3. Fetch mastered count globally
          const { count: totalMastered } = await supabase
            .from('user_word_states')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('mastery_state', ['Learned', 'Mastered']);
          setMasteredCount(totalMastered || 0);

          // 4. Fetch Mastery Progress per List
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
              
              return {
                name: list.name,
                percentage,
                total: totalInList || 0
              };
            }));
            setMasteryData(masteryResults);
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
          Welcome back, {user?.email?.split('@')[0] || 'Student'}!
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
              <button onClick={() => navigate('/lists')} className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : words.length > 0 ? (
                words.slice(0, 5).map((word) => (
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
                ))
              ) : (
                <p className="text-center py-8 text-gray-500 italic">No words found. Start exploring!</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mastery Progress</h3>
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
    </div>
  );
};
