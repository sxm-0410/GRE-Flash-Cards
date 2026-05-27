import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Word } from '../types';

export const useWords = (listId?: string) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        let fetchError;

        if (listId) {
          // Fetch words for a specific list
          const { data: listItems, error: itemsError } = await supabase
            .from('word_list_items')
            .select('word_id')
            .eq('list_id', listId);

          if (itemsError) throw itemsError;

          if (listItems && listItems.length > 0) {
            const wordIds = listItems.map(item => item.word_id);
            const { data: wordsData, error: wordsError } = await supabase
              .from('words')
              .select('*')
              .in('id', wordIds);
            
            data = wordsData;
            fetchError = wordsError;
          } else {
            data = [];
          }
        } else {
          // Fetch all words (or a subset for the dashboard)
          const { data: allWords, error: allWordsError } = await supabase
            .from('words')
            .select('*')
            .limit(50);
          
          data = allWords;
          fetchError = allWordsError;
        }

        if (fetchError) throw fetchError;

        // Fetch user session to get user ID
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        // Fetch user's word states if logged in and we have words
        const userStatesMap = new Map();
        if (userId && data && data.length > 0) {
          const wordIds = data.map((w: any) => w.id);
          const { data: states, error: statesError } = await supabase
            .from('user_word_states')
            .select('word_id, mastery_state')
            .eq('user_id', userId)
            .in('word_id', wordIds);
            
          if (!statesError && states) {
            states.forEach(s => userStatesMap.set(s.word_id, s.mastery_state));
          }
        }

        const transformedWords: Word[] = (data || []).map((w: any) => ({
          id: w.id,
          word: w.word,
          partOfSpeech: w.part_of_speech,
          definition: w.definition,
          example: w.example,
          synonym: w.synonym,
          antonym: w.antonym,
          difficulty: w.difficulty,
          masteryState: userStatesMap.get(w.id) || 'Unseen'
        }));

        setWords(transformedWords);
      } catch (err: any) {
        console.error('useWords error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [listId]);

  return { words, loading, error };
};
