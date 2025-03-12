'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Skeleton from 'react-loading-skeleton';
import { CalenderIcon } from '../Svgs';
import FollowUnfollowButton from '../FollowUnfollowButton';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function UserProfileTop({ profile, username, isLoading, isAuthenticated, isOwnProfile, isFollowing, followingCount, followersCount }) {
  const router = useRouter();

  return (
    <div className="relative px-3 py-2">
      {/* avatar container */}
      <div className="absolute -top-10">
        <Avatar className="h-[80px] w-[80px]">
          {isLoading ? (
            <AvatarFallback>
              <Skeleton circle width={80} height={80} />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.display_name}`} />
              <AvatarFallback>{profile?.display_name?.slice(0, 2).toUpperCase() || '?'}</AvatarFallback>
            </>
          )}
        </Avatar>
      </div>
      <div className="flex items-end justify-end pb-2">
        {isAuthenticated && (
          <>
            {!isOwnProfile ? (
              <FollowUnfollowButton followingId={profile.id} initialIsFollowing={isFollowing} profile={profile} onFollowChange={() => router.refresh()} />
            ) : (
              <Link
                href="/settings/profile"
                className="w-[100px] flex items-center justify-center border border-[#536471] hover:bg-zinc-900/80 hover:text-[var(--white)] h-8 rounded-full text-sm text-[var(--white)]"
              >
                Edit profile
              </Link>
            )}
          </>
        )}
      </div>
      {/* information container */}
      <div className="text-[var(--white)]">
        <h1 className="text-lg font-semibold leading-[21px]">{profile?.display_name}</h1>
        <p className="text-sm text-[var(--textSubtitle)]">{profile?.username && `@${profile?.username}`}</p>
        <p className="text-sm text-[var(--white)] my-1">{profile?.bio}</p>
        <div className="text-sm text-[var(--textSubtitle)]">
          {profile?.created_at && (
            <div className="flex items-center gap-1">
              <CalenderIcon /> <span>Joined</span>
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </div>
          )}
        </div>
        <div className="flex gap-4 my-1">
          <Link href={`/${username}/followers`} className="text-[var(--textSubtitle)] text-sm">
            <span className="text-[var(--white)]">{followingCount}</span> Following
          </Link>
          <Link href={`/${username}/following`} className="text-[var(--textSubtitle)] text-sm">
            <span className="text-[var(--white)]">{followersCount}</span> Follower
          </Link>
        </div>
      </div>
    </div>
  );
}
