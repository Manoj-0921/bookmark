export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Bookmark {
    id: string;
    user_id: string;
    title: string;
    url: string;
    created_at: string;
}

export interface User {
    id: string;
    email?: string;
    user_metadata?: {
        avatar_url?: string;
        full_name?: string;
        name?: string;
    };
}

export type Database = {
    public: {
        Tables: {
            bookmarks: {
                Row: Bookmark;
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    url: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    url?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
