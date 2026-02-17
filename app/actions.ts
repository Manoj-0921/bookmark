'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(url: string, title?: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to add bookmarks' }
    }

    const finalTitle = title?.trim() || new URL(url).hostname

    // Insert bookmark
    const { error } = await supabase
        .from('bookmarks')
        .insert([{
            user_id: user.id,
            title: finalTitle,
            url: url.trim(),
        }] as any)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
