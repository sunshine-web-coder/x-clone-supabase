// hooks/useFollow.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseConfig';

export function useFollow(profileId, currentUserId) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset states when profile changes
    setIsFollowing(false);
    setFollowersCount(0);
    setFollowingCount(0);

    if (!profileId || !currentUserId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if following
        const { data: followData } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', profileId)
          .maybeSingle();

        setIsFollowing(!!followData);

        // Get followers count
        const { count: followers } = await supabase
          .from('followers')
          .select('*', { count: 'exact' })
          .eq('following_id', profileId);

        // Get following count
        const { count: following } = await supabase
          .from('followers')
          .select('*', { count: 'exact' })
          .eq('follower_id', profileId);

        setFollowersCount(followers || 0);
        setFollowingCount(following || 0);
      } catch (error) {
        console.error('Error fetching follow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId, currentUserId]);

  const toggleFollow = async () => {
    if (!currentUserId || !profileId || profileId === currentUserId) return;

    setLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', profileId);

        if (error) throw error;
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: currentUserId,
            following_id: profileId
          });

        if (error) throw error;
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    followingCount,
    loading,
    toggleFollow
  };
}
