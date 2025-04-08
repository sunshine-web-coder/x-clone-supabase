import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';
import usePostStore from '@/store/usePostStore';

export function usePostEngagement(postId) {
  const { sessionId } = useAuthStore();
  const posts = usePostStore(state => state.posts);

  // State variables - initialized as null instead of 0
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [replyCount, setReplyCount] = useState(null);

  // Get replies count from Zustand store
  useEffect(() => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setReplyCount(post.replies?.length || null);
    }
  }, [posts, postId]);

  // Generic count fetcher that keeps null values instead of defaulting to 0
  const fetchCount = useCallback(
    async (viewName, countColumn, setter) => {
      if (!postId) return;
      const { data } = await supabase.from(viewName).select(countColumn).eq('post_id', postId).single();

      // Only set the count if it's greater than 0, otherwise keep it null
      if (data && data[countColumn] > 0) {
        setter(data[countColumn]);
      } else {
        setter(null);
      }
    },
    [postId]
  );

  // Fetch all engagement counts
  useEffect(() => {
    fetchCount('post_view_counts', 'view_count', setViewCount);
    fetchCount('post_bookmark_counts', 'bookmark_count', setBookmarkCount);
    fetchCount('post_like_counts', 'like_count', setLikeCount);
    fetchCount('post_retweet_counts', 'retweet_count', setRepostCount);
  }, [fetchCount]);

  // Check user's engagement status
  useEffect(() => {
    const checkEngagement = async () => {
      if (!sessionId || !postId) return;

      // Check bookmarks
      const { data: bookmarkData } = await supabase.from('bookmarks').select().eq('user_id', sessionId).eq('post_id', postId).maybeSingle();
      setIsBookmarked(!!bookmarkData);

      // Check likes
      const { data: likeData } = await supabase.from('likes').select().eq('user_id', sessionId).eq('post_id', postId).maybeSingle();
      setIsLiked(!!likeData);

      // Check retweets
      const { data: retweetData } = await supabase.from('retweets').select().eq('user_id', sessionId).eq('post_id', postId).maybeSingle();
      setIsReposted(!!retweetData);
    };

    checkEngagement();
  }, [sessionId, postId]);

  // Generic engagement toggler with optimistic updates
  const toggleEngagement = async (table, isActive, setActive, countSetter, currentCount) => {
    if (!sessionId) return;

    // Optimistically update the UI first
    setActive(!isActive);

    // Calculate new count value
    let newCount;
    if (isActive) {
      // If removing engagement, set to null if count would become 0
      newCount = currentCount === 1 ? null : currentCount ? currentCount - 1 : null;
    } else {
      // If adding engagement, set to 1 if count was null, otherwise increment
      newCount = currentCount === null ? 1 : currentCount + 1;
    }

    countSetter(newCount);

    try {
      if (isActive) {
        await supabase.from(table).delete().eq('user_id', sessionId).eq('post_id', postId);
      } else {
        await supabase.from(table).insert({
          user_id: sessionId,
          post_id: postId
        });
      }
    } catch (error) {
      console.error(`Error toggling ${table}:`, error);
      // Revert the optimistic updates on error
      setActive(isActive);
      countSetter(currentCount);
    }
  };

  return {
    isBookmarked,
    bookmarkCount,
    isLiked,
    likeCount,
    isReposted,
    repostCount,
    viewCount,
    replyCount,
    toggleBookmark: () => toggleEngagement('bookmarks', isBookmarked, setIsBookmarked, setBookmarkCount, bookmarkCount),
    toggleLike: () => toggleEngagement('likes', isLiked, setIsLiked, setLikeCount, likeCount),
    toggleRepost: () => toggleEngagement('retweets', isReposted, setIsReposted, setRepostCount, repostCount)
  };
}
