'use client';

import { useState } from 'react';
import { MoreHorizontal, UserPlus, Ban, Trash2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostEngagement from './PostEngagement';
import { PopoverAction } from '../PopoverAction';
import { ReplyModal } from './ReplyPostModal';
import { ComposeTweet } from '../compose-tweet';
import { format } from 'date-fns';
import useAuthStore from '@/store/useAuthStore';
import PostDeleteConfirmModal from './PostDeleteConfirmModal';

export default function SinglePostCard({ id, content, media_urls, created_at, profiles }) {
  const { sessionId } = useAuthStore();
  const [showReply, setShowReply] = useState(false);
  const [showPostDeleteModal, setShowPostDeleteModal] = useState(false);

  const isOwner = sessionId === profiles?.id; // Check if user is post owner

  const handlePopoverItemClick = (item, index) => {
    if (item.label === 'Delete') {
      setShowPostDeleteModal(true);
    }
  };

  // Adjust menu items based on ownership
  const postMenu = isOwner
    ? [
        { icon: Trash2, label: 'Delete' },
        { icon: PenLine, label: 'Edit' }
      ]
    : [
        { icon: UserPlus, label: `Follow @${profiles?.username}` },
        { icon: Ban, label: `Block @${profiles?.username}` }
      ];

  return (
    <>
      <article className="border-b border-zinc-700 p-3 transition-colors cursor-pointer">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profiles?.display_name}`} />
                <AvatarFallback>{profiles?.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <Link href={`/${profiles?.username}`} className="font-bold text-sm max-w-max marker:text-[var(--white)] hover:underline truncate">
                  {profiles?.display_name}
                </Link>
                <Link href={`/${profiles?.username}`} className="text-gray-500 text-sm max-w-max truncate">
                  {profiles?.username && `@${profiles?.username}`}
                </Link>
              </div>
            </div>
            <PopoverAction menuItems={postMenu} onItemClick={handlePopoverItemClick}>
              <Button variant="variant" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-500 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </PopoverAction>
          </div>

          {/* Content */}
          <div className="space-y-3 text-[15px] break-words">
            <p className="text-wrap text-[var(--white)]">{content}</p>

            {/* Media Gallery */}
            {media_urls && media_urls.length > 0 && (
              <div className="mt-4 mb-3 w-full">
                <div className={`grid gap-2 ${media_urls.length === 1 ? 'grid-cols-1' : media_urls.length === 2 ? 'grid-cols-2' : media_urls.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {media_urls.map((url, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden ${media_urls.length === 3 && index === 0 ? 'col-span-2' : ''} ${media_urls.length > 1 ? 'w-full h-[130px]' : ''}`}
                      style={{
                        aspectRatio: media_urls.length === 1 ? '15/9' : '1/1'
                      }}
                    >
                      <Image src={url || '/placeholder.svg'} alt={`Media ${index + 1}`} layout="fill" objectFit="cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <span className="text-gray-500 text-sm">{format(new Date(created_at), "h:mm a '·' MMM d, yyyy")}</span>
        </div>

        {/* Engagement - Pass the post ID */}
        <div className="border-y border-zinc-700 mt-3">
          <PostEngagement postId={id} profiles={profiles} content={content} setShowReply={setShowReply} />
        </div>
        <div className="mt-2">
          <ComposeTweet parentId={id} parentUsername={profiles?.username} isReply={true} />
        </div>
      </article>

      {/* Reply modal */}
      {showReply && <ReplyModal showReply={showReply} setShowReply={setShowReply} parentId={id} parentUsername={profiles?.username} />}
      {showPostDeleteModal && <PostDeleteConfirmModal showPostDeleteModal={showPostDeleteModal} setShowPostDeleteModal={setShowPostDeleteModal} postId={id} media_urls={media_urls} />}    
    </>
  );
}
