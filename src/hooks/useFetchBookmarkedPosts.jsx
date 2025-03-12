import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';

export const useFetchBookmarkedPosts = () => {
  const { sessionId } = useAuthStore();

  const fetchBookmarkedPosts = async () => {
    if (!sessionId) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select(
        `
        post_id,
        posts (
          content,
          media_urls,
          created_at,
          user_id,
          users (
            display_name, 
            avatar_url, 
            username
          )
        )
      `
      )
      .eq('user_id', sessionId);

    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ['bookmarkedPosts', sessionId],
    queryFn: fetchBookmarkedPosts,
    enabled: !!sessionId
  });
};
