# 🚀 Quick Start Guide

This guide will help you get your Smart Bookmark App up and running in **15 minutes**!

## ✅ Step-by-Step Setup

### 1️⃣ Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - Name: `bookmark-app`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

### 2️⃣ Set Up Database (2 minutes)

1. In your new Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON bookmarks FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" 
ON bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
ON bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
```

4. Click **"Run"** ✅

### 3️⃣ Enable Real-time (1 minute)

1. Go to **Database** → **Replication** (left sidebar)
2. Find `bookmarks` table
3. Toggle **ON** the switch ✅

### 4️⃣ Get API Keys (1 minute)

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** 
   - **anon public** key

### 5️⃣ Configure Google OAuth (5 minutes)

#### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**:
   - APIs & Services → Library → Search "Google+ API" → Enable
4. Go to **APIs & Services** → **Credentials**
5. Click **"Create Credentials"** → **"OAuth client ID"**
6. Configure consent screen if needed:
   - User Type: External
   - App name: Smart Bookmark Manager
   - Your email for support
7. Create OAuth client:
   - Application type: **Web application**
   - Name: Smart Bookmark Manager
   - Authorized redirect URIs: 
     ```
     https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
     ```
     (Replace `<YOUR_PROJECT_REF>` with your Supabase project reference - find it in your Supabase Project URL)
8. **Copy** Client ID and Client Secret

#### B. Add to Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste **Client ID** and **Client Secret**
4. Click **Save** ✅

### 6️⃣ Configure Your App (1 minute)

1. In your project folder, create `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 7️⃣ Run the App! 🎉

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Testing Checklist

Try these to make sure everything works:

- [ ] Click "Sign in with Google" → Should redirect to Google
- [ ] Sign in with your Google account → Should redirect back to app
- [ ] See your profile picture and email in header
- [ ] Add a bookmark with a URL
- [ ] See the bookmark appear in the list
- [ ] Open app in another tab → Add bookmark → See it appear in first tab (real-time!)
- [ ] Delete a bookmark → Should disappear immediately
- [ ] Sign out → Should redirect to welcome page

---

## 🐛 Common Issues

### "Invalid login credentials"

**Fix**: Check that Google OAuth is configured correctly in both Google Cloud Console and Supabase. Make sure redirect URI matches exactly.

### Environment variables not working

**Fix**: 
1. Make sure `.env.local` exists in the root folder
2. Restart the dev server: `Ctrl+C` then `npm run dev`
3. Variables must start with `NEXT_PUBLIC_`

### Bookmarks not showing

**Fix**:
1. Check browser console for errors (F12)
2. Verify RLS policies are created in Supabase
3. Make sure you're signed in

### Real-time not working

**Fix**:
1. Verify Realtime is enabled for `bookmarks` table in Supabase
2. Check browser console for WebSocket errors
3. Try refreshing the page

---

## 🚀 Next Steps

Your app is running! Here are some ideas to extend it:

1. **Add Categories** - Organize bookmarks into folders
2. **Add Search** - Search through your bookmarks
3. **Add Tags** - Tag bookmarks for easy filtering
4. **Add Favorites** - Mark important bookmarks
5. **Add Sharing** - Share specific bookmarks with friends

---

## 📚 Learn More

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Full documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Need help?** Check the troubleshooting section in [DOCUMENTATION.md](./DOCUMENTATION.md)
