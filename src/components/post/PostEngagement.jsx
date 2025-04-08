'use client';

import { MessageCircle, Repeat, Heart, BarChart2, Share, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostEngagement } from '@/hooks/usePostEngagement';
import { repostMenuItems, shareMenuItems, getRepostMenuItems } from '@/menuData/menuItems';
import { PopoverAction } from '../PopoverAction';

export default function PostEngagement({ postId, setShowReply }) {
  const { 
    isBookmarked, 
    bookmarkCount, 
    isLiked, 
    likeCount, 
    isReposted,
    repostCount,
    viewCount, 
    replyCount, 
    toggleBookmark, 
    toggleLike,
    toggleRepost
  } = usePostEngagement(postId);

  const handlePopoverItemClick = (item) => {
    if (item.label === 'Copy link') {
      navigator.clipboard.writeText('https://twitter.com/hubdotxyz/status/123456789');
      alert('Link copied to clipboard!');
    }
  };

  const handleRepostItemClick = (item) => {
    if (item.action === 'repost') {
      toggleRepost();
    } else if (item.action === 'quote') {
      // Handle quote post functionality
      console.log('Quote post:', postId);
    }
  };

  return (
    <div className="flex justify-between items-center text-gray-500" onClick={e => e.stopPropagation()}>
      {/* Reply Button */}
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500" onClick={() => setShowReply(true)}>
          <MessageCircle className="h-5 w-5" />
        </Button>
        <span className="group-hover:text-blue-500">{replyCount ?? ''}</span>
      </div>

      {/* Repost Button with Popover */}
      <PopoverAction menuItems={getRepostMenuItems(isReposted)} onItemClick={handleRepostItemClick}>
        <div className="flex items-center text-sm group">
          <Button 
            variant="variant" 
            size="icon" 
            className={`h-8 w-8 rounded-full group-hover:bg-green-500/10 ${
              isReposted ? 'text-green-500' : 'group-hover:text-green-500'
            }`}
          >
            <Repeat className={`h-5 w-5 ${isReposted ? 'stroke-green-500' : ''}`} />
          </Button>
          <span className={`group-hover:text-green-500 ${isReposted ? 'text-green-500' : ''}`}>
            {repostCount ?? ''}
          </span>
        </div>
      </PopoverAction>

      {/* Like Button */}
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-[#F91880]/10 group-hover:[#F91880]" onClick={toggleLike}>
          <Heart className={`h-5 w-5 group-hover:stroke-[#F91880] ${isLiked ? 'fill-[#F91880] stroke-[#F91880]' : ''}`} />
        </Button>
        <span className={`group-hover:text-[#F91880] ${isLiked ? 'text-[#F91880]' : ''}`}>{likeCount ?? ''}</span>
      </div>

      {/* View Count */}
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
          <BarChart2 className="h-5 w-5" />
        </Button>
        <span className="group-hover:text-blue-500">{viewCount ?? ''}</span>
      </div>

      {/* Bookmark Button */}
      <div className="flex items-center text-sm group">
        <Button variant="variant" size="icon" className="h-8 w-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500" onClick={toggleBookmark}>
          {isBookmarked ? <BookmarkCheck className="h-5 w-5 fill-blue-500 stroke-blue-500" /> : <Bookmark className="h-5 w-5 group-hover:stroke-blue-500" />}
        </Button>
        <span className={`group-hover:text-blue-500 ${isBookmarked ? 'text-blue-500' : ''}`}>{bookmarkCount ?? ''}</span>
      </div>

      {/* Share Button */}
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