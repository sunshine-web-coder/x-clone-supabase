'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseConfig';
import Link from 'next/link';
import FollowUnfollowButton from '@/components/FollowUnfollowButton';
import { useGetUserByUsername, useFollowerCount, useFollowingCount } from '@/routes/userService';
import useAuthStore from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFollowStatus } from '@/hooks/useFollowStatus';
import Sidebar from '@/components/sidebar';
import RightContent from '@/components/RightContent';
import AuthLayout from '@/components/Layouts/MainLayout';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import UserProfileTop from './UserProfileTop';
import CoverImage from './CoverImage';
import GoBack from '../GoBack';

export default function UserProfile() {
  const { username, id } = useParams();
  const { sessionId, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const hiddenRoutes = new RegExp(`^/${username}/status/${id}$`);
  const shouldShowUserProfile = !hiddenRoutes.test(pathname);

  // Use the query hooks
  const { data: userWithPosts, isLoading, error } = useGetUserByUsername(username);

  // Extract profile and posts from the returned data
  const profile = userWithPosts ? { ...userWithPosts, posts: undefined } : null;
  const posts = userWithPosts?.posts || [];
  const postsCount = posts.length;

  // Get follow counts
  const { data: followersCount = 0 } = useFollowerCount(profile?.id);
  const { data: followingCount = 0 } = useFollowingCount(profile?.id);

  // Check if current user is following this profile
  const { data: isFollowing = false } = useFollowStatus(profile?.id);

  const handleAvatarUpload = async avatarUrl => {
    try {
      const { error } = await supabase.from('users').update({ avatar_url: avatarUrl }).eq('id', sessionId);

      if (error) throw error;

      useAuthStore.setState(state => ({
        userData: { ...state.userData, avatar_url: avatarUrl }
      }));

      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-5">
        <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
      </div>
    );
  if (error) return <div className="p-4">Error loading profile</div>;
  if (!profile) return <div className="p-4">User not found</div>;

  const isOwnProfile = sessionId === profile.id;

  return (
    <>
      {shouldShowUserProfile && (
        <div>
          <div className="border-none mb-3 sticky top-0 z-50">
            <GoBack title={`${profile.display_name}`} subtitle={`${postsCount.toLocaleString()} posts`} />
          </div>
          <Separator className="bg-zinc-700" />
          <div className="relative">
            {/* cover image component */}
            <CoverImage profile={profile} />
            {/* information & avatar component */}
            <UserProfileTop
              profile={profile}
              username={username}
              isFollowing={isFollowing}
              followingCount={followingCount}
              isOwnProfile={isOwnProfile}
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
              followersCount={followersCount}
            />
            <nav className="border-b border-zinc-700 flex items-center">
              {[
                { label: 'Posts', href: `/${profile.username}` },
                { label: 'Replies', href: `/${profile.username}/replies` },
                { label: 'Media', href: `/${profile.username}/media` },
                { label: 'Likes', href: `/${profile.username}/likes` }
              ].map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link key={label} href={href} className={`text-sm px-5 p-3 ${isActive ? 'text-white font-semibold border-b-2 border-white' : 'text-[var(--textSubtitle)] hover:bg-zinc-900/80'}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
