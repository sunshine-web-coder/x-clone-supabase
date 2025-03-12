'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseConfig';
import Link from 'next/link';
import FollowUnfollowButton from '@/components/FollowUnfollowButton';
import useAuthStore from '@/store/useAuthStore';

export default function FollowingPage() {
  const { username } = useParams();
  const userData = useAuthStore(state => state.userData);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followsYou, setFollowsYou] = useState({});
  const [userFollowing, setUserFollowing] = useState({});

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const { data: profileData } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .single();

        if (!profileData) return;

        const { data, error } = await supabase
          .from('followers')
          .select(`
            following:following_id (
              id,
              username,
              display_name
            )
          `)
          .eq('follower_id', profileData.id);

        if (error) throw error;

        const followingList = data.map(item => item.following);
        setFollowing(followingList);

        if (userData?.id) {
          const followsYouData = {};
          const followingData = {};

          await Promise.all(
            followingList.map(async (user) => {
              // Check if user follows current user
              const { data: follows } = await supabase
                .from('followers')
                .select()
                .eq('follower_id', user.id)
                .eq('following_id', userData.id)
                .single();
              
              followsYouData[user.id] = !!follows;

              // Check if current user follows user
              const { data: isFollowing } = await supabase
                .from('followers')
                .select()
                .eq('follower_id', userData.id)
                .eq('following_id', user.id)
                .single();
              
              followingData[user.id] = !!isFollowing;
            })
          );

          setFollowsYou(followsYouData);
          setUserFollowing(followingData);
        }
      } catch (error) {
        console.error('Error fetching following:', error);
      } finally {
        setLoading(false);
      }
    }

    if (username && userData?.id) {
      fetchFollowing();
    }
  }, [username, userData?.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      <div className="space-y-4">
        {following.map(user => (
          <div 
            key={user.id}
            className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-gray-100"
          >
            <Link 
              href={`/${user.username}`}
              className="flex items-center space-x-3"
            >
              <div>
                <p className="font-semibold">{user.display_name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  {followsYou[user.id] && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Follows you
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <FollowUnfollowButton
              followingId={user.id}
              initialIsFollowing={userFollowing[user.id]}
              onFollowChange={(isFollowing) => {
                setUserFollowing(prev => ({
                  ...prev,
                  [user.id]: isFollowing
                }));
              }}
              className="ml-4"
            />
          </div>
        ))}
        {following.length === 0 && (
          <p className="text-muted-foreground">Not following anyone yet</p>
        )}
      </div>
    </div>
  );
}