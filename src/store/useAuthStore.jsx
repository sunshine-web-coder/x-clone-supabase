import { supabase } from '@/lib/supabaseConfig';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encrypt, decrypt } from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';

// Encryption key - store this in .env
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

// Custom storage object with encryption
const encryptedStorage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      const decrypted = decrypt(value, ENCRYPTION_KEY).toString(utf8);
      return JSON.parse(decrypted); // Parse the decrypted string back to an object
    } catch (err) {
      console.error('Failed to decrypt storage:', err);
      localStorage.removeItem(key); // Clear invalid data
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      const stringified = JSON.stringify(value); // Convert value to string before encryption
      const encrypted = encrypt(stringified, ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (err) {
      console.error('Failed to encrypt data:', err);
    }
  },
  removeItem: (key) => localStorage.removeItem(key),
};

const useAuthStore = create(
  persist(
    (set) => ({
      // Only store essential authentication state
      isAuthenticated: false,
      sessionId: null,

      setUser: (user, userData) => {
        if (!user) {
          set({ isAuthenticated: false, sessionId: null });
          return;
        }

        set({
          isAuthenticated: true,
          sessionId: user.id,
        });
      },

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

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, username, display_name")
            .eq("id", data.user.id)
            .single();

          if (userError) return { error: userError };

          // Only store minimal auth state
          set({
            isAuthenticated: true,
            sessionId: data.user.id,
          });

          return { user: data.user, userData };
        } catch (err) {
          console.error("Network error:", err);
          return { error: { message: "An unexpected error occurred." } };
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ isAuthenticated: false, sessionId: null });
        } catch (err) {
          console.error("Logout error:", err);
          return { error: { message: "Failed to log out." } };
        }
      },

      checkAuth: async () => {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();

          set({
            isAuthenticated: !!user,
            sessionId: user?.id || null,
          });

          return !!user;
        } catch (err) {
          console.error("Auth check error:", err);
          set({ isAuthenticated: false, sessionId: null });
          return false;
        }
      },

      signup: async (display_name, username, email, password) => {
        if (!navigator.onLine) {
          return { error: { message: 'No internet connection.' } };
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

          set({
            isAuthenticated: true,
            sessionId: authData.user.id,
          });

          return { user: authData.user, userData: dbUser };
        } catch (err) {
          console.error("Signup error:", err);
          return { error: { message: "An unexpected error occurred." } };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: encryptedStorage,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
      }),
    }
  )
);

export default useAuthStore;