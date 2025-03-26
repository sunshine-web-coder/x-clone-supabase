'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function FollowUnfollowButton({ profile, followingId, initialIsFollowing = false, onFollowChange = () => {}, className = '' }) {
  const { sessionId, isAuthenticated } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (!sessionId || !isAuthenticated) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        setShowUnfollowModal(true);
      } else {
        await followUser();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const followUser = async () => {
    const { error } = await supabase.from('followers').insert([{ follower_id: sessionId, following_id: followingId }]);
    if (error) throw error;
    setIsFollowing(true);
    onFollowChange(true);
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('followers').delete().eq('follower_id', sessionId).eq('following_id', followingId);

      if (error) throw error;
      setIsFollowing(false);
      onFollowChange(false);
      setShowUnfollowModal(false);
    } catch (error) {
      console.error('Error unfollowing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionId || !isAuthenticated || sessionId === followingId) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant={isFollowing ? 'outline' : 'default'}
        onClick={handleFollowToggle}
        onMouseEnter={() => isFollowing && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={isLoading}
        className={`border border-[#536471] h-8 font-semibold rounded-full text-sm w-[100px] ${
          isFollowing ? 'text-[var(--white)] hover:bg-[#ff000015] hover:text-red-500 hover:border-red-500' : 'border-none bg-[var(--white)] hover:bg-gray-100 text-[var(--black)]'
        }`}
      >
        {isFollowing ? (hovered ? 'Unfollow' : 'Following') : 'Follow'}
      </Button>

      {/* Unfollow Confirmation Modal */}
      <Dialog open={showUnfollowModal} onOpenChange={setShowUnfollowModal} className="p-4">
        <DialogContent className="max-w-[280px] bg-[var(--background)] !rounded-[18px] border-none">
          <DialogHeader className="text-[var(--white)]">
            <DialogTitle className="">Unfollow {profile.username && `@${profile.username}?`}</DialogTitle>
            <DialogDescription className="!my-2 leading-4">Their posts will no longer show up in your For You timeline. You can still view their profile, unless their posts are protected.</DialogDescription>
            <DialogFooter>
              <div className="w-full flex flex-col gap-2">
                <Button variant="destructive" className="rounded-full border-none bg-[var(--white)] hover:bg-gray-100 text-[var(--black)]" onClick={handleUnfollow} disabled={isLoading}>
                  Unfollow
                </Button>
                <Button variant="outline" className="border border-[#536471] hover:bg-zinc-900/80 hover:text-[var(--white)] h-8 rounded-full text-sm text-[var(--white)]" onClick={() => setShowUnfollowModal(false)}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
