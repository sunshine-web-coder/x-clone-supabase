'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';

// Helper function to check if error is network related
const isNetworkError = (error) => {
  return !window.navigator.onLine || 
         error.message?.includes('Failed to fetch') ||
         error.message?.includes('Network') ||
         error.code === 'NETWORK_ERROR';
};

// Custom error handler that returns user-friendly messages
const handleQueryError = (error) => {
  if (isNetworkError(error)) {
    return {
      message: 'Unable to connect. Please check your internet connection.',
      type: 'network',
      retryable: true
    };
  }
  
  if (error.code === 'PGRST116') {
    return {
      message: 'Resource not found.',
      type: 'not_found',
      retryable: false
    };
  }
  
  // Handle Supabase specific errors
  if (error.code?.startsWith('PGRST')) {
    return {
      message: 'Database error. Please try again later.',
      type: 'database',
      retryable: true
    };
  }
  
  return {
    message: 'Something went wrong. Please try again later.',
    type: 'unknown',
    retryable: true
  };
};

// Fetch all posts
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        throw handleQueryError(error);
      }
    },
    retry: (failureCount, error) => error.retryable && failureCount < 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
  });
};

// Fetch post by ID
export const usePostById = (postId) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) return null;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        throw handleQueryError(error);
      }
    },
    enabled: !!postId,
    retry: (failureCount, error) => error.retryable && failureCount < 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
  });
};
