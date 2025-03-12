import AuthLayout from '@/components/AuthLayout';
import { ComposeTweet } from '@/components/compose-tweet';
import RightContent from '@/components/RightContent';
import Sidebar from '@/components/sidebar';
import { TweetFeed } from '@/components/tweet-feed';
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <>
      <ComposeTweet />
      <TweetFeed />
    </>
  );
}
