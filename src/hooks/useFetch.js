import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';

const fetchData = async (table, filter) => {
  let query = supabase.from(table).select('*');

  Object.entries(filter).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query.single();
  if (error) throw new Error(error.message);
  return data;
};

export function useFetch(table, filter) {
  return useQuery({
    queryKey: [table, filter],
    queryFn: () => fetchData(table, filter),
    staleTime: 1000 * 5, //for 5 seconds
    retry: 1,
  });
}
