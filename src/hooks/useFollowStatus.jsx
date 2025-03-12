'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';

// Custom hook to check if the current user is following another user
export const useFollowStatus = (followingId) => {
  const { sessionId, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['followStatus', sessionId, followingId],
    queryFn: async () => {
      if (!sessionId || !followingId || !isAuthenticated) return false;
      
      try {
        const { data, error } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', sessionId)
          .eq('following_id', followingId);
        
        if (error) {
          throw error;
        }
        
        // If we have data and it's not empty, user is following
        return data && data.length > 0;
      } catch (error) {
        console.error('Error checking follow status:', error);
        return false; // Default to not following in case of error
      }
    },
    enabled: !!sessionId && !!followingId && isAuthenticated,
  });
};