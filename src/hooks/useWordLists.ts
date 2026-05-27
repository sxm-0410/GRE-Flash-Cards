import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface WordList {
  id: string;
  name: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  tier_access: 'free' | 'premium';
  word_count: number;
}

export const useWordLists = () => {
  const [lists, setLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all lists
        const { data: listsData, error: listsError } = await supabase
          .from('word_lists')
          .select('*')
          .order('created_at', { ascending: true });

        if (listsError) throw listsError;

        // 2. Fetch counts for each list separately to avoid complex join issues during debugging
        const transformedLists = await Promise.all((listsData || []).map(async (list: any) => {
          const { count, error: countError } = await supabase
            .from('word_list_items')
            .select('*', { count: 'exact', head: true })
            .eq('list_id', list.id);
          
          if (countError) console.error(`Error counting words for list ${list.id}:`, countError);

          return {
            id: list.id,
            name: list.name,
            difficulty: list.difficulty,
            tier_access: list.tier_access,
            word_count: count || 0
          };
        }));

        setLists(transformedLists);
      } catch (err: any) {
        console.error('useWordLists error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  return { lists, loading, error };
};
