// src/store/useAuthStore.js
import { supabase } from '@/lib/supabaseConfig';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userData: null,
      setUser: (user, userData) => set({ user, userData }),

      login: async (email, password) => {
        if (!navigator.onLine) {
          return { error: { message: "You are offline. Please check your internet connection." } };
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) return { error };

          // Fetch additional user data
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, display_name, email, avatar_url, bio, website, location, created_at")
            .eq("id", data.user.id)
            .single();

          if (userError) return { error: userError };

          set({ user: data.user, userData });

          return { user: data.user, userData };
        } catch (err) {
          console.error("Network error:", err);

          // Handle specific fetch errors
          if (err instanceof TypeError) {
            return { error: { message: "Failed to connect to the server. Please check your internet connection." } };
          }

          return { error: { message: "An unexpected error occurred. Please try again later." } };
        }
      },

      logout: async () => {
        if (!navigator.onLine) {
          return { error: { message: 'Cannot log out while offline.' } };
        }

        try {
          await supabase.auth.signOut();
          set({ user: null, userData: null });
        } catch (err) {
          console.error("Logout error:", err);
          return { error: { message: "Failed to log out. Please check your internet connection." } };
        }
      },

      checkAuth: async () => {
        if (!navigator.onLine) {
          console.warn('Offline: Skipping auth check.');
          return;
        }

        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user) {
            set({ user: null, userData: null });
            return;
          }

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, username, display_name, email, avatar_url, bio, website, location, created_at')
            .eq('id', user.id)
            .single();

          set({ user, userData: userError ? null : userData });
        } catch (err) {
          console.error("Auth check error:", err);
          set({ user: null, userData: null });
        }
      },

      signup: async (display_name, username, email, password) => {
        if (!navigator.onLine) {
          return { error: { message: 'No internet connection. Please try again later.' } };
        }

        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) return { error: authError };

          const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                display_name,
                username,
                email,
              },
            ])
            .single();

          if (dbError) {
            await supabase.auth.admin.deleteUser(authData.user.id);
            return { error: dbError };
          }

          set({ user: authData.user, userData: dbUser });

          return { user: authData.user, userData: dbUser };
        } catch (err) {
          console.error("Signup error:", err);

          if (err instanceof TypeError) {
            return { error: { message: "Failed to connect to the server. Please check your internet connection." } };
          }

          return { error: { message: "An unexpected error occurred. Please try again later." } };
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;