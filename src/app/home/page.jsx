import { ComposeTweet } from '@/components/compose-tweet';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import { PostFeed } from '@/components/post/PostFeed';
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <>
      <div className="border-y p-4 py-2 border-zinc-700">
        <ComposeTweet />
      </div>
      <PostFeed />
    </>
  );
}
