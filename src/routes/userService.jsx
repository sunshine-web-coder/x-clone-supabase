'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';
import useAuthStore from '@/store/useAuthStore';

// Fetch current user data by session ID
export const useCurrentUser = () => {
  const { sessionId, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['currentUser', sessionId],
    queryFn: async () => {
      if (!sessionId || !isAuthenticated) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('id, username, display_name, avatar_url, bio')
        .eq('id', sessionId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!sessionId && isAuthenticated,
  });
};

// Fetch user by username along with their posts
export const useGetUserByUsername = (username) => {
  return useQuery({
    queryKey: ['userWithPosts', username],
    queryFn: async () => {
      if (!username) return null;
      
      // First, fetch the user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, display_name, avatar_url, bio')
        .eq('username', username)
        .single();
        
      if (userError) throw userError;
      if (!userData) return null;
      
      // Then, fetch all posts for this user
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });
        
      if (postsError) throw postsError;
      
      // Return combined user data with posts
      return {
        ...userData,
        posts: postsData || []
      };
    },
    enabled: !!username,
  });
};

// Fetch user profile by ID
export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['userId', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('id, username, display_name, avatar_url, bio')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

// Follower count hook
export const useFollowerCount = (userId) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
        
      if (error) throw error;
      // More explicit null handling
      return count === null ? 0 : count;
    },
    enabled: !!userId,
  });
};

// Following count hook
export const useFollowingCount = (userId) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
        
      if (error) throw error;
      // More explicit null handling
      return count === null ? 0 : count;
    },
    enabled: !!userId,
  });
};