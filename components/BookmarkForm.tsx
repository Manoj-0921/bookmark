'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function BookmarkForm() {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            // Validate URL
            try {
                new URL(url);
            } catch {
                setError('Please enter a valid URL');
                setLoading(false);
                return;
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('You must be logged in to add bookmarks');
                setLoading(false);
                return;
            }

            // Insert bookmark
            const { error: insertError } = await supabase
                .from('bookmarks')
                .insert({
                    user_id: user.id,
                    title: title.trim() || new URL(url).hostname,
                    url: url.trim(),
                } as any)


            if (insertError) throw insertError;

            // Dispatch local event for instant update in the same tab
            window.dispatchEvent(new CustomEvent('bookmark-added'));

            // Reset form and show success
            setUrl('');
            setTitle('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

        } catch (err: any) {
            setError(err.message || 'Failed to add bookmark');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                        URL *
                    </label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title (optional)
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Site"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <button
                id="add-bookmark-btn"
                type="submit"
                disabled={loading || !url}
                className={`w-full sm:w-auto px-8 py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${success ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Adding...
                    </span>
                ) : success ? (
                    <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Added Successfully!
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Bookmark
                    </span>
                )}
            </button>
        </form>
    );
}
