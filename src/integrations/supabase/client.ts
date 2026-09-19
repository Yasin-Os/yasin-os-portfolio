import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  (SUPABASE_URL as string) || "", 
  (SUPABASE_PUBLISHABLE_KEY as string) || "", 
  { auth: { persistSession: true, autoRefreshToken: true } }
);
