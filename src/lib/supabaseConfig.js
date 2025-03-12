import { createClient } from '@supabase/supabase-js';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key) => getCookie(key),
      setItem: (key, value) => setCookie(key, value),
      removeItem: (key) => deleteCookie(key),
    },
  },
});
