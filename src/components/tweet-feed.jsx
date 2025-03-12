'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Repeat2, Heart, Share, Loader2 } from 'lucide-react';
import { useFetchPosts } from '@/routes/useFetchPosts';
import PostCard from './post-card';

export function TweetFeed() {
  const { data: posts, isLoading, isError } = useFetchPosts();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 mx-auto max-w-[270px] text-center mt-5">Failed to load posts. Please try again or check your internet connection.</div>;
  }

  return (
    <div className="">
      {posts?.map(post => {
        const { id, content, media_urls, created_at, profiles } = post;
        return <PostCard key={id} id={id} content={content} media_urls={media_urls} created_at={created_at} profiles={profiles} />;
      })}
    </div>
  );
}
