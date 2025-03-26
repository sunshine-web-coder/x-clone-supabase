'use client';

import { useState } from 'react';
import { MoreHorizontal, UserPlus, Ban, Trash2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FormattedDate from './FormattedDate';
import { useRouter } from 'next/navigation';
import PostEngagement from './PostEngagement';
import { PopoverAction } from './PopoverAction';
import { ReplyModal } from './ReplyPostModal';
import useAuthStore from '@/store/useAuthStore';
import PostDeleteConfirmModal from './PostDeleteConfirmModal';

export default function PostCard({ id, content, media_urls, created_at, profiles }) {
  const router = useRouter();
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
      <article className="border-b border-zinc-700 p-2 pb-1 transition-colors cursor-pointer" onClick={() => router.push(`/${profiles?.username}/status/${id}`)}>
        {/* Header */}
        <div className="flex gap-4 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profiles?.display_name}`} />
            <AvatarFallback>{(profiles?.display_name || 'UU').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {/* Add min-w-0 to allow text truncation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="flex items-center gap-1 min-w-0">
                  {/* Add min-w-0 here as well */}
                  <Link href={`/${profiles?.username}`} className="font-bold text-[var(--white)] hover:underline truncate" onClick={e => e.stopPropagation()}>
                    {profiles?.display_name}
                  </Link>
                  <Link href={`/${profiles?.username}`} className="text-gray-500 truncate" onClick={e => e.stopPropagation()}>
                    {profiles?.username && `@${profiles?.username}`}
                  </Link>
                  <span className="text-gray-500 flex-shrink-0">·</span>
                  <span className="text-gray-500 truncate">
                    <FormattedDate timestamp={created_at} />
                  </span>
                </div>
              </div>
              <PopoverAction menuItems={postMenu} onItemClick={handlePopoverItemClick}>
                <Button variant="variant" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-500 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </PopoverAction>
            </div>
            {/* Content */}
            <div className="mt-2 space-y-3 text-[15px] break-words">
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
        </div>
        {/* Engagement - Pass the post ID */}
        <div className="pl-[40px]">
          <PostEngagement postId={id} profiles={profiles} content={content} setShowReply={setShowReply} />
        </div>
      </article>

      {/* Reply modal */}
      {showReply && <ReplyModal showReply={showReply} setShowReply={setShowReply} parentId={id} parentUsername={profiles?.username} />}
      {showPostDeleteModal && <PostDeleteConfirmModal showPostDeleteModal={showPostDeleteModal} setShowPostDeleteModal={setShowPostDeleteModal} postId={id} media_urls={media_urls} />}
    </>
  );
}
