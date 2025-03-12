'use client';

import { MoreHorizontal, MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import UserAvatar from './UserAvatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/store/useAuthStore';
import FormattedDate from './FormattedDate';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

dayjs.extend(relativeTime);

export default function PostCard({ id, content, media_urls, created_at, profiles }) {
  return (
    <article className="border border-b-0 border-[white]/10 p-4 transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profiles?.display_name}`} />
          <AvatarFallback>{profiles?.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          {' '}
          {/* Add min-w-0 to allow text truncation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="flex items-center gap-1 min-w-0">
                {' '}
                {/* Add min-w-0 here as well */}
                <Link href={`/${profiles.username}`} className="font-bold text-[var(--white)] hover:underline truncate">
                  {profiles.display_name}
                </Link>
                <Link href={`/${profiles.username}`} className="text-gray-500 truncate">
                  {profiles.username && `@${profiles.username}`}
                </Link>
                <span className="text-gray-500 flex-shrink-0">·</span>
                <span className="text-gray-500 truncate">
                  <FormattedDate timestamp={created_at} />
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/20 hover:text-blue-500 flex-shrink-0">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          {/* Content */}
          <div className="mt-2 space-y-3 text-[15px] break-words">
            <p className="text-wrap text-[var(--white)]">{content}</p>

            {/* Media Gallery */}
            {media_urls && media_urls.length > 0 && (
              <div className="mt-4 mb-3 relative w-full">
                <div className="aspect-[16/9] w-full">
                  {' '}
                  {/* Fixed aspect ratio container */}
                  <Swiper
                    slidesPerView={media_urls.length === 1 ? 1 : 2}
                    spaceBetween={10}
                    navigation={media_urls.length > 1}
                    pagination={media_urls.length > 1 ? { clickable: true } : false}
                    modules={[Navigation, Pagination]}
                    className="mySwiper !absolute inset-0 h-full w-full"
                  >
                    {media_urls.map((url, index) => (
                      <SwiperSlide key={index} className="h-full">
                        <div className={`relative h-full w-full ${media_urls.length === 1 ? 'rounded-xl overflow-hidden' : ''}`}>
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Media ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className={media_urls.length > 1 ? 'rounded-xl' : ''}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Engagement */}
      <div className="flex justify-between items-center mt-4 text-gray-500 pl-[55px]">
        <Button variant="ghost" size="icon" className="hover:text-blue-500 flex items-center gap-1 text-sm">
          <MessageCircle className="h-5 w-5" />
          <span>304</span>
        </Button>
        <Button variant="ghost" size="icon" className="hover:text-green-500 flex items-center gap-1 text-sm">
          <Repeat2 className="h-5 w-5" />
          <span>681</span>
        </Button>
        <Button variant="ghost" size="icon" className="hover:text-pink-500 flex items-center gap-1 text-sm">
          <Heart className="h-5 w-5" />
          <span>742</span>
        </Button>
        <Button variant="ghost" size="icon" className="hover:text-blue-500 flex items-center gap-1 text-sm">
          <BarChart2 className="h-5 w-5" />
          <span>49K</span>
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="hover:text-blue-500 h-8 w-8 rounded-full">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-blue-500 h-8 w-8 rounded-full">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
