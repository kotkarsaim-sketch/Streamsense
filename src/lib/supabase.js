import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True only when real credentials have been added to .env
export const IS_CONFIGURED =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your_supabase');

export const supabase = IS_CONFIGURED
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
