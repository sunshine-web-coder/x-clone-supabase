'use client';

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseConfig';

// Sign up mutation hook
export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password, username, display_name }) => {
      // First, sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      // Then, create the user profile in the users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          username,
          display_name,
          avatar_url: null,
          bio: ''
        }
      ]);

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      return authData;
    },
    onError: error => {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  });
};

// Sign in mutation hook
export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    }
  });
};

// Sign out mutation hook
export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  });
};

// Password reset mutation hook
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async email => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    }
  });
};
