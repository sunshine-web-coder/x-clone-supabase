'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseConfig';
import Link from 'next/link';
import FollowUnfollowButton from '@/components/FollowUnfollowButton';
import useAuthStore from '@/store/useAuthStore';

export default function FollowersPage() {
  const { username } = useParams();
  const userData = useAuthStore(state => state.userData);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followsYou, setFollowsYou] = useState({});
  const [following, setFollowing] = useState({});

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const { data: profileData } = await supabase.from('users').select('id').eq('username', username).single();

        if (!profileData) return;

        const { data, error } = await supabase
          .from('followers')
          .select(
            `
            follower:follower_id (
              id,
              username,
              display_name
            )
          `
          )
          .eq('following_id', profileData.id);

        if (error) throw error;

        const followersList = data.map(item => item.follower);
        setFollowers(followersList);

        if (userData?.id) {
          const followsYouData = {};
          const followingData = {};

          await Promise.all(
            followersList.map(async follower => {
              // Check if follower follows current user
              const { data: follows } = await supabase.from('followers').select().eq('follower_id', follower.id).eq('following_id', userData.id).single();

              followsYouData[follower.id] = !!follows;

              // Check if current user follows follower
              const { data: isFollowing } = await supabase.from('followers').select().eq('follower_id', userData.id).eq('following_id', follower.id).single();

              followingData[follower.id] = !!isFollowing;
            })
          );

          setFollowsYou(followsYouData);
          setFollowing(followingData);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setLoading(false);
      }
    }

    if (username && userData?.id) {
      fetchFollowers();
    }
  }, [username, userData?.id]);

  if (loading) return <div>Loading followers...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Followers</h1>
      <div className="space-y-4">
        {followers.map(follower => (
          <div key={follower.id} className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-gray-100">
            <Link href={`/${follower.username}`} className="flex items-center space-x-3">
              <div>
                <p className="font-semibold">{follower.display_name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">@{follower.username}</p>
                  {followsYou[follower.id] && <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Follows you</span>}
                </div>
              </div>
            </Link>
            <FollowUnfollowButton
              followingId={follower.id}
              initialIsFollowing={following[follower.id]}
              onFollowChange={isFollowing => {
                setFollowing(prev => ({
                  ...prev,
                  [follower.id]: isFollowing
                }));
              }}
              className="ml-4"
            />
          </div>
        ))}
        {followers.length === 0 && <p className="text-muted-foreground">No followers yet</p>}
      </div>
    </div>
  );
}
