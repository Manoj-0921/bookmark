'use client';

import { createClient } from '@/lib/supabase/client';
import { Bookmark } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const fetchBookmarks = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setBookmarks([]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setBookmarks(data);
            }
            setLoading(false);

            // Set up real-time subscription
            channel = supabase
                .channel('bookmarks_channel')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setBookmarks((current) => [payload.new as Bookmark, ...current]);
                        } else if (payload.eventType === 'DELETE') {
                            setBookmarks((current) =>
                                current.filter((bookmark) => bookmark.id !== payload.old.id)
                            );
                        } else if (payload.eventType === 'UPDATE') {
                            setBookmarks((current) =>
                                current.map((bookmark) =>
                                    bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                                )
                            );
                        }
                    }
                )
                .subscribe();
        };

        fetchBookmarks();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [supabase]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting bookmark:', error);
            alert('Failed to delete bookmark');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                ))}
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                    <svg
                        className="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookmarks yet</h3>
                <p className="text-gray-600">Add your first bookmark using the form above!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                {bookmark.title}
                            </h3>
                        </div>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            disabled={deletingId === bookmark.id}
                            className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Delete bookmark"
                        >
                            {deletingId === bookmark.id ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
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
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mb-4 text-sm text-blue-600 hover:text-blue-800 truncate hover:underline"
                    >
                        {bookmark.url}
                    </a>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(bookmark.created_at)}</span>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Visit
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
