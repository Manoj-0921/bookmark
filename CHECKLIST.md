# ✅ Setup Checklist

Follow this checklist to ensure everything is set up correctly.

## 📋 Pre-Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Google Cloud account created

## 🗄️ Supabase Setup

- [ ] Created new Supabase project
- [ ] Ran `supabase-setup.sql` in SQL Editor
- [ ] Verified `bookmarks` table exists
- [ ] Enabled Realtime for `bookmarks` table
- [ ] Copied Project URL
- [ ] Copied Anon Key

## 🔐 Google OAuth Setup

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Added redirect URI: `https://<project>.supabase.co/auth/v1/callback`
- [ ] Copied Client ID
- [ ] Copied Client Secret
- [ ] Added credentials to Supabase (Auth → Providers → Google)

## 💻 Local Setup

- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Started dev server (`npm run dev`)
- [ ] Opened http://localhost:3000

## 🧪 Testing

- [ ] "Sign in with Google" button appears
- [ ] Clicking sign-in redirects to Google
- [ ] After signing in, redirected back to app
- [ ] Profile picture and email appear in header
- [ ] Can add a bookmark
- [ ] Bookmark appears in list
- [ ] Can delete a bookmark
- [ ] Real-time works (tested in 2 tabs)
- [ ] Can sign out successfully

## 🚀 Production (Optional)

- [ ] Code pushed to GitHub
- [ ] Imported to Vercel
- [ ] Environment variables added to Vercel
- [ ] Deployed successfully
- [ ] Production URL works
- [ ] Google OAuth works in production
- [ ] Custom domain configured (if desired)

## 🎨 Customization (Optional)

- [ ] Updated `README.md` with your info
- [ ] Changed color scheme in `app/globals.css`
- [ ] Modified app name in `app/layout.tsx`
- [ ] Added your own features

---

## 🐛 If Something Doesn't Work

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review browser console (F12)
3. Check Supabase logs
4. Verify environment variables
5. Restart dev server

---

## 📚 Documentation Quick Links

- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md) - 15-minute setup
- **Full Docs**: [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete reference
- **Development**: [DEVELOPMENT.md](./DEVELOPMENT.md) - Extend the app
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Go to production
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix issues

---

**✨ Once all checkboxes are ticked, you're ready to go!**
