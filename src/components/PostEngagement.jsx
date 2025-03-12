'use client';

import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, BookmarkCheck, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';

export default function PostEngagement({ postId }) {
  const { sessionId } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch bookmark count
  const fetchBookmarkCount = useCallback(async () => {
    if (!postId) return;
    const { data } = await supabase
      .from('post_bookmark_counts')
      .select('bookmark_count')
      .eq('post_id', postId)
      .single();
    setBookmarkCount(data?.bookmark_count || 0);
  }, [postId]);

  // Fetch like count
  const fetchLikeCount = useCallback(async () => {
    if (!postId) return;
    const { data } = await supabase
      .from('post_like_counts')
      .select('like_count')
      .eq('post_id', postId)
      .single();
    setLikeCount(data?.like_count || 0);
  }, [postId]);

  // Check user's engagement status
  useEffect(() => {
    const checkEngagement = async () => {
      if (!sessionId || !postId) return;

      // Check bookmark
      const { data: bookmarkData } = await supabase
        .from('bookmarks')
        .select()
        .eq('user_id', sessionId)
        .eq('post_id', postId)
        .maybeSingle();
      setIsBookmarked(!!bookmarkData);

      // Check like
      const { data: likeData } = await supabase
        .from('likes')
        .select()
        .eq('user_id', sessionId)
        .eq('post_id', postId)
        .maybeSingle();
      setIsLiked(!!likeData);
    };

    checkEngagement();
    fetchBookmarkCount();
    fetchLikeCount();
  }, [sessionId, postId, fetchBookmarkCount, fetchLikeCount]);

  // Handle bookmark toggle
  const handleBookmark = async e => {
    e.stopPropagation();
    if (!sessionId) return;

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', sessionId)
          .eq('post_id', postId);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: sessionId, post_id: postId });
      }
      setIsBookmarked(!isBookmarked);
      await fetchBookmarkCount();
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  // Handle like toggle
  const handleLike = async e => {
    e.stopPropagation();
    if (!sessionId) return;

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', sessionId)
          .eq('post_id', postId);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: sessionId, post_id: postId });
      }
      setIsLiked(!isLiked);
      await fetchLikeCount();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4 text-gray-500 pl-[55px]" onClick={e => e.stopPropagation()}>
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <span>4k</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full">
          <Repeat2 className="h-5 w-5" />
        </Button>
        <span>100</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button 
          variant="variant" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 stroke-red-500' : ''}`} />
        </Button>
        <span className={isLiked ? 'text-red-500' : ''}>{likeCount}</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full">
          <BarChart2 className="h-5 w-5" />
        </Button>
        <span>4k</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button 
          variant="variant" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={handleBookmark}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 fill-blue-500 stroke-blue-500" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
        <span className={isBookmarked ? 'text-blue-500' : ''}>{bookmarkCount}</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full">
          <Share className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}