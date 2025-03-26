'use client';

import { Loader2 } from 'lucide-react';
import { useFetchMainPosts } from '@/routes/useFetchPosts'; // Updated import
import PostCard from './PostCard';
import Loader from './Loader';

export function PostFeed() {
  const { data: mainPosts, isLoading, isError } = useFetchMainPosts(); // Updated hook

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-sky-500 text-center mt-5">Failed to load posts. Please try again or check your internet connection.</div>;
  }

  return (
    <>
      {mainPosts?.map(post => {
        const { id, content, media_urls, created_at, profiles } = post;
        return <PostCard key={id} id={id} content={content} media_urls={media_urls} created_at={created_at} profiles={profiles} />;
      })}
    </>
  );
}
