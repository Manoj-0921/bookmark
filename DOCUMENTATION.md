# Smart Bookmark Manager - Complete Documentation

## 📚 Overview

This is a modern bookmark management application built with Next.js 15, Supabase, and Google OAuth. It allows users to save, organize, and manage their bookmarks with real-time synchronization across devices.

## 🎯 Features

- ✅ **Google OAuth Authentication** - Secure login with Google (no password required)
- ✅ **Private Bookmarks** - Each user's bookmarks are completely private
- ✅ **Real-time Updates** - Changes sync instantly across all open tabs
- ✅ **Add Bookmarks** - Save URLs with custom titles
- ✅ **Delete Bookmarks** - Remove bookmarks you no longer need
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety and better developer experience |
| **Supabase** | Backend (Auth, Database, Real-time) |
| **Tailwind CSS** | Styling and responsive design |
| **Google OAuth** | User authentication |

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. A **Supabase account** - [Sign up free](https://supabase.com/)
4. A **Google Cloud account** - [Sign up here](https://console.cloud.google.com/)

## 🚀 Setup Instructions

### Step 1: Supabase Setup

1. **Create a New Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project"
   - Enter project details (name, password, region)
   - Wait for the project to be ready (2-3 minutes)

2. **Create the Bookmarks Table**
   - In your Supabase project, go to the **SQL Editor**
   - Copy and paste the following SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON bookmarks FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" 
ON bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
ON bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
```

   - Click "Run" to execute the SQL
   - ✅ Your database is now ready!

3. **Enable Realtime**
   - Go to **Database** → **Replication**
   - Find the `bookmarks` table
   - Toggle **Enable** for Realtime
   - ✅ Real-time sync is now active!

4. **Get Your API Keys**
   - Go to **Settings** → **API**
   - Copy these two values:
     - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` `public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Google OAuth Setup

1. **Create a Google Cloud Project**(https://console.cloud.google.com/
   - Go to [Google Cloud Console])
   - Click "Select a project" → "New Project"
   - Enter a project name → Click "Create"

2. **Enable Google+ API**
   - In the sidebar, go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click on it and click "Enable"

3. **Create OAuth Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - If prompted, configure the OAuth consent screen:
     - User Type: **External**
     - App name: `Smart Bookmark Manager`
     - User support email: Your email
     - Developer contact: Your email
     - Click **Save and Continue** through all steps
   
4. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: `Smart Bookmark Manager`
   - Authorized redirect URIs:
     - Add: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
     - Replace `<YOUR_SUPABASE_PROJECT_REF>` with your project reference from Supabase URL
   - Click **Create**
   - Copy your **Client ID** and **Client Secret**

5. **Configure Google Provider in Supabase**
   - Go to your Supabase project
   - Navigate to **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle it **ON**
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

### Step 3: Environment Variables

Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

### Step 4: Install and Run

```bash
# Install dependencies (already done during setup)
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## 📁 Project Structure

```
bookmark/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts     # OAuth callback handler
│   └── globals.css          # Global styles
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase
│   │   ├── server.ts        # Server-side Supabase
│   │   └── middleware.ts    # Auth middleware
│   └── types.ts             # TypeScript types
├── components/
│   ├── AuthButton.tsx       # Sign in/out button
│   ├── BookmarkForm.tsx     # Add bookmark form
│   └── BookmarkList.tsx     # List of bookmarks
├── .env.local               # Environment variables (not in git)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Project dependencies
```

## 🏗️ Architecture

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to Supabase callback URL
4. Supabase handles the session and redirects to app
5. User is now authenticated

### Data Flow

1. **Client** → Writes bookmark to Supabase
2. **Supabase** → Stores in database (validates with RLS)
3. **Supabase Realtime** → Broadcasts change
4. **All Clients** → Receive update and refresh UI

### Security

- **Row Level Security (RLS)**: Ensures users can only access their own bookmarks
- **OAuth**: Secure authentication via Google
- **Server-side validation**: All database operations are validated on the server

## 🎨 UI Components

### 1. AuthButton
- Shows user profile picture and email when logged in
- "Sign in with Google" button when logged out
- Logout functionality

### 2. BookmarkForm
- URL input with validation
- Title input
- Submit button
- Visual feedback on submission

### 3. BookmarkList
- Displays all user's bookmarks
- Real-time updates
- Delete functionality
- Empty state when no bookmarks

## 🔧 Key Files Explained

### `lib/supabase/client.ts`
Client-side Supabase client for browser operations.

### `lib/supabase/server.ts`
Server-side Supabase client for server components and API routes.

### `lib/supabase/middleware.ts`
Handles session refresh and cookie management.

### `app/auth/callback/route.ts`
Handles the OAuth callback from Google/Supabase.

## 🐛 Troubleshooting

### "Invalid login credentials"
- Check that Google OAuth is properly configured in Supabase
- Verify redirect URIs match exactly

### Bookmarks not appearing
- Check browser console for errors
- Verify RLS policies are created
- Check that Realtime is enabled for the `bookmarks` table

### Real-time not working
- Ensure Realtime is enabled in Supabase
- Check that the subscription is created correctly
- Look for WebSocket errors in browser console

### Environment variables not loading
- Make sure `.env.local` exists in the root directory
- Restart the development server after changing `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Update Google OAuth Redirect URI

After deployment, add your production URL to Google OAuth:
- Go to Google Cloud Console → Credentials
- Edit your OAuth client
- Add: `https://<YOUR_SUPABASE_PROJECT>.supabase.co/auth/v1/callback`
- Save

## 🎓 For Developers

### Adding New Features

**Example: Add a "Favorite" Feature**

1. Update database:
```sql
ALTER TABLE bookmarks ADD COLUMN is_favorite BOOLEAN DEFAULT false;
```

2. Update TypeScript type in `lib/types.ts`:
```typescript
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  is_favorite: boolean; // Add this
  created_at: string;
}
```

3. Update UI to show/toggle favorite status

### Best Practices

- Always use TypeScript types
- Keep components small and focused
- Use Server Components when possible (better performance)
- Handle loading and error states
- Test on multiple browsers

## 📝 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
# Run SQL in Supabase SQL Editor

# Deploy
git push             # Vercel will auto-deploy
```

## 🤝 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review Supabase logs in the Dashboard
3. Check browser console for errors
4. Verify environment variables are set correctly

## 📄 License

MIT License - feel free to use this for learning or personal projects!

---

**Built with ❤️ using Next.js and Supabase**
