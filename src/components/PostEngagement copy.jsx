'use client';

// import { MessageCircle, Repeat, Heart, BarChart2, Bookmark, BookmarkCheck, Share } from 'lucide-react';
import { Copy, MessageCircle, Repeat, Heart, BarChart2, Share, Send, Bookmark, BookmarkCheck, ExternalLink, Link2, Mail, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';
import { PopoverAction } from './PopoverAction';

export default function PostEngagement({ postId }) {
  const { sessionId } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  // Add view count fetch
  const fetchViewCount = useCallback(async () => {
    if (!postId) return;
    const { data } = await supabase.from('post_view_counts').select('view_count').eq('post_id', postId).single();
    setViewCount(data?.view_count || 0);
  }, [postId]);

  // Track view when component mounts
  useEffect(() => {
    const trackView = async () => {
      if (!sessionId || !postId) return;

      try {
        await supabase.from('views').upsert({ user_id: sessionId, post_id: postId }, { onConflict: ['user_id', 'post_id'] });

        await fetchViewCount();
      } catch (error) {
        console.error('View tracking error:', error);
      }
    };

    trackView();
  }, [sessionId, postId, fetchViewCount]);

  // Fetch bookmark count
  const fetchBookmarkCount = useCallback(async () => {
    if (!postId) return;
    const { data } = await supabase.from('post_bookmark_counts').select('bookmark_count').eq('post_id', postId).single();
    setBookmarkCount(data?.bookmark_count || 0);
  }, [postId]);

  // Fetch like count
  const fetchLikeCount = useCallback(async () => {
    if (!postId) return;
    const { data } = await supabase.from('post_like_counts').select('like_count').eq('post_id', postId).single();
    setLikeCount(data?.like_count || 0);
  }, [postId]);

  // Check user's engagement status
  useEffect(() => {
    const checkEngagement = async () => {
      if (!sessionId || !postId) return;

      // Check bookmark
      const { data: bookmarkData } = await supabase.from('bookmarks').select().eq('user_id', sessionId).eq('post_id', postId).maybeSingle();
      setIsBookmarked(!!bookmarkData);

      // Check like
      const { data: likeData } = await supabase.from('likes').select().eq('user_id', sessionId).eq('post_id', postId).maybeSingle();
      setIsLiked(!!likeData);
    };

    checkEngagement();
    fetchBookmarkCount();
    fetchLikeCount();
    fetchViewCount();
  }, [sessionId, postId, fetchBookmarkCount, fetchLikeCount, fetchViewCount]);

  // Handle bookmark toggle
  const handleBookmark = async e => {
    e.stopPropagation();
    if (!sessionId) return;

    try {
      if (isBookmarked) {
        await supabase.from('bookmarks').delete().eq('user_id', sessionId).eq('post_id', postId);
      } else {
        await supabase.from('bookmarks').insert({ user_id: sessionId, post_id: postId });
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
        await supabase.from('likes').delete().eq('user_id', sessionId).eq('post_id', postId);
      } else {
        await supabase.from('likes').insert({ user_id: sessionId, post_id: postId });
      }
      setIsLiked(!isLiked);
      await fetchLikeCount();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handlePopoverItemClick = (item, index) => {
    console.log(`Clicked: ${item.label}`);

    // Handle specific actions
    if (item.label === 'Copy link') {
      navigator.clipboard.writeText('https://twitter.com/hubdotxyz/status/123456789');
      alert('Link copied to clipboard!');
    }
  };

  // Share menu items with both buttons and links
  const shareMenuItems = [
    { icon: Link2, label: 'Copy link' },
    { icon: Share, label: 'Share post via ...' },
    {
      icon: Mail,
      label: 'Send via Direct Message',
      href: '/messages/compose?tweet=123456789'
    },
  ];

    // Retweet menu items with both buttons and links
    const retweetMenuItems = [
      { icon: Repeat, label: "Repost" },
      { icon: PencilLine, label: "Quote" },
    ]

  return (
    <div className="flex justify-between items-center mt-4 text-gray-500 pl-[55px]" onClick={e => e.stopPropagation()}>
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <span className='group-hover:text-blue-500'>4k</span>
      </div>

      <PopoverAction menuItems={retweetMenuItems} onItemClick={handlePopoverItemClick}>
        <div className="flex items-center text-sm group">
          <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500">
            <Repeat className="h-5 w-5" />
          </Button>
          <span className="group-hover:text-green-500">4k</span>
        </div>
      </PopoverAction>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-[#F91880]/10 group-hover:[#F91880]" onClick={handleLike}>
          <Heart className={`h-5 w-5 group-hover:stroke-[#F91880] ${isLiked ? 'fill-[#F91880] stroke-[#F91880]' : ''}`} />
        </Button>
        <span className={`group-hover:text-[#F91880] ${isLiked ? 'text-[#F91880]' : ''}`}>{likeCount}</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
          <BarChart2 className="h-5 w-5" />
        </Button>
        <span className="group-hover:text-blue-500">{viewCount}</span>
      </div>

      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500" onClick={handleBookmark}>
          {isBookmarked ? <BookmarkCheck className="h-5 w-5 fill-blue-500 stroke-blue-500" /> : <Bookmark className="h-5 w-5 group-hover:stroke-blue-500" />}
        </Button>
        <span className={`group-hover:text-blue-500 ${isBookmarked ? 'text-blue-500' : ''}`}>{bookmarkCount}</span>
      </div>

      <PopoverAction menuItems={shareMenuItems} onItemClick={handlePopoverItemClick}>
        <div className="flex items-center text-sm group">
          <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </PopoverAction>
    </div>
  );
}
