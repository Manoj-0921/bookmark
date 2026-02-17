# 📚 Smart Bookmark Manager

A modern, real-time bookmark management application built with Next.js 15 and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google (no passwords!)
- 🔒 **Private Bookmarks** - Your bookmarks are visible only to you
- ⚡ **Real-time Sync** - Changes appear instantly across all tabs and devices
- 📱 **Responsive Design** - Beautiful UI that works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- 🚀 **Fast Performance** - Built with Next.js 15 App Router and Server Components

## 🎯 What You'll Learn

This project is perfect for developers who want to learn:

- Next.js 15 App Router and Server Components
- Supabase authentication and database
- Real-time subscriptions with Supabase Realtime
- Row Level Security (RLS) for data privacy
- TypeScript with React
- Modern UI design with Tailwind CSS
- OAuth integration (Google)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)
- A Google Cloud account (free)

### Installation

1. **Clone or use this repository**

```bash
cd bookmark
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase and Google OAuth**

Follow the detailed guide in [QUICKSTART.md](./QUICKSTART.md) - it takes about 15 minutes!

4. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials.

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bookmark/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── auth/
│       └── callback/
│           └── route.ts     # OAuth callback handler
├── components/              # React components
│   ├── AuthButton.tsx      # Authentication button
│   ├── BookmarkForm.tsx    # Add bookmark form
│   └── BookmarkList.tsx    # Bookmark list with real-time
├── lib/                     # Utilities and configurations
│   ├── types.ts            # TypeScript types
│   └── supabase/
│       ├── client.ts       # Client-side Supabase
│       ├── server.ts       # Server-side Supabase
│       └── middleware.ts   # Session refresh logic
├── middleware.ts           # Next.js middleware
├── .env.example           # Environment variables template
├── QUICKSTART.md         # 15-minute setup guide
└── DOCUMENTATION.md      # Complete documentation
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 15 minutes
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete documentation with architecture, troubleshooting, and more

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | Backend as a Service (Auth, Database, Real-time) |
| **Tailwind CSS** | Utility-first CSS framework |
| **Google OAuth** | Authentication provider |

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security ensuring users can only access their own bookmarks
- **Server-side Authentication** - Secure session management with HTTP-only cookies
- **OAuth 2.0** - Industry-standard authentication via Google
- **HTTPS Everywhere** - Secure connections in production

## 🎨 UI/UX Highlights

- **Gradient Backgrounds** - Modern, eye-catching design
- **Smooth Animations** - Micro-interactions for better UX
- **Loading States** - Visual feedback for all actions
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - System preference detection
- **Custom Scrollbars** - Polished details

## 🧪 How to Test Real-time

1. Open the app in two browser tabs
2. Sign in to both tabs
3. Add a bookmark in one tab
4. Watch it appear instantly in the other tab! ✨

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Don't forget to update your Google OAuth redirect URI with your production URL.

## 🎓 For Beginners

If you're new to web development, here's the learning path:

1. **Start with the basics**
   - Understand TypeScript syntax
   - Learn React fundamentals
   - Get familiar with Next.js basics

2. **Understand the components**
   - Read through `components/AuthButton.tsx` first
   - Then `components/BookmarkForm.tsx`
   - Finally `components/BookmarkList.tsx`

3. **Learn about Supabase**
   - Authentication flow
   - Database queries
   - Real-time subscriptions

4. **Experiment!**
   - Try adding new features
   - Modify the UI
   - Break things and fix them (best way to learn!)

## 🤝 Contributing

This is a learning project! Feel free to:

- Add new features
- Improve the UI
- Fix bugs
- Enhance documentation

## 📝 Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed troubleshooting steps.

Quick fixes:

- **Can't sign in?** Check Google OAuth configuration
- **Bookmarks not showing?** Check browser console for errors
- **Real-time not working?** Verify Realtime is enabled in Supabase

## 📄 License

MIT License - Free to use for learning and personal projects!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

**Happy coding! 🚀**

If you found this helpful, consider giving it a ⭐!
