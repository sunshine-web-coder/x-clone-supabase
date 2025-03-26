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
import defaultAvatar from '../assets/avatars/default_profile_400x400.png';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex border-b border-zinc-700 gap-2 w-full p-3 pt-2 pb-1 transition-colors cursor-pointer" onClick={() => router.push(`/${profiles?.username}/status/${id}`)}>
      <div className="w-10">
        {profiles?.avatar_url ? (
          <Image src={profiles.avatar_url} width={40} height={40} className="w-10 h-10 rounded-full" alt={`${profiles?.display_name}'s avatar`} />
        ) : (
          <Image src={defaultAvatar} width={40} height={40} className="w-10 h-10 rounded-full" alt="Default avatar" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex relative items-start justify-between">
          <div className="flex items-center justify-start gap-1 text-sm text-gray-500">
            <Link href={`/${profiles?.username}`} className="font-bold text-[var(--white)] hover:underline truncate" onClick={e => e.stopPropagation()}>
              {profiles?.display_name}
            </Link>
            <Link href={`/${profiles?.username}`} className="text-gray-500 truncate" onClick={e => e.stopPropagation()}>
              {profiles?.username && `@${profiles?.username}`}
            </Link>
            <span>·</span>
            <span className="text-xs">
              <FormattedDate timestamp={created_at} />
            </span>
          </div>
          <PopoverAction menuItems={postMenu} onItemClick={handlePopoverItemClick}>
            <Button variant="variant" size="icon" className="h-7 w-7 absolute -top-1 right-0 rounded-full hover:bg-blue-500/20 hover:text-blue-500 flex-shrink-0" onClick={e => e.stopPropagation()}>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </PopoverAction>
        </div>
        <div className="space-y-1 text-[15px] break-words mt-[2px]">
          <p className="mb-3 text-[var(--white)] whitespace-pre-line">{content}</p>

          {/* Media Gallery */}
          {media_urls && media_urls.length > 0 && (
            <div className="mb-1 w-full">
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

          {/* Engagement */}
          <PostEngagement postId={id} profiles={profiles} content={content} setShowReply={setShowReply} />
        </div>
      </div>
    </div>
  );
}
