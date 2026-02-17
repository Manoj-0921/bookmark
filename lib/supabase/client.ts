import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Client-side Supabase client (Singleton)
 * Used in Client Components and browser-side code
 */
export function createClient() {
    if (supabaseClient) return supabaseClient;

    supabaseClient = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    return supabaseClient;
}
