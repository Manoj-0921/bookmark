# 📁 Project Structure Overview

Complete file structure and explanation of the Smart Bookmark Manager.

```
bookmark/
│
├── 📱 App (Next.js App Router)
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, metadata, fonts
│   │   ├── page.tsx                   # Home page (main UI)
│   │   ├── globals.css                # Global styles, custom CSS
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts           # OAuth callback handler
│   │
│   ├── components/
│   │   ├── AuthButton.tsx             # Sign in/out button + user info
│   │   ├── BookmarkForm.tsx           # Add bookmark form
│   │   └── BookmarkList.tsx           # List bookmarks (real-time)
│   │
│   └── lib/
│       ├── types.ts                   # TypeScript type definitions
│       └── supabase/
│           ├── client.ts              # Browser Supabase client
│           ├── server.ts              # Server Supabase client
│           └── middleware.ts          # Session refresh logic
│
├── 🔧 Configuration
│   ├── middleware.ts                  # Next.js middleware (session mgmt)
│   ├── next.config.ts                 # Next.js configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── eslint.config.mjs              # ESLint configuration
│   └── postcss.config.mjs             # PostCSS configuration
│
├── 📚 Documentation
│   ├── README.md                      # Project overview
│   ├── QUICKSTART.md                  # 15-minute setup guide
│   ├── DOCUMENTATION.md               # Complete documentation
│   ├── DEVELOPMENT.md                 # Development guide
│   ├── DEPLOYMENT.md                  # Deployment guide
│   ├── TROUBLESHOOTING.md             # Troubleshooting guide
│   ├── CHECKLIST.md                   # Setup checklist
│   └── PROJECT_STRUCTURE.md           # This file!
│
├── 🗄️ Database
│   └── supabase-setup.sql             # Database setup SQL
│
├── ⚙️ Setup
│   ├── .env.example                   # Environment variables template
│   └── setup.sh                       # Interactive setup script
│
└── 📦 Dependencies
    ├── package.json                   # NPM dependencies
    ├── package-lock.json              # Locked dependency versions
    └── node_modules/                  # Installed packages (not in git)
```

---

## 📄 File Descriptions

### Core Application Files

#### `app/page.tsx` (Main Page)
- **Purpose**: Home page that users see
- **What it does**:
  - Shows welcome screen for logged-out users
  - Shows bookmark manager for logged-in users
  - Renders `AuthButton`, `BookmarkForm`, `BookmarkList`
- **Type**: Server Component
- **Dependencies**: All components, Supabase server client

#### `app/layout.tsx` (Root Layout)
- **Purpose**: Wraps entire application
- **What it does**:
  - Sets up HTML structure
  - Loads fonts (Inter)
  - Adds metadata for SEO
  - Imports global CSS
- **Type**: Server Component
- **Affects**: Every page in the app

#### `app/globals.css` (Global Styles)
- **Purpose**: Application-wide styles
- **What it contains**:
  - Tailwind directives
  - CSS variables for theming
  - Custom scrollbar styles
  - Smooth transitions
- **Imported by**: `layout.tsx`

---

### Components

#### `components/AuthButton.tsx`
- **Type**: Client Component (`'use client'`)
- **Purpose**: Handle authentication
- **Features**:
  - Shows "Sign in with Google" when logged out
  - Shows user profile + "Sign out" when logged in
  - Real-time auth state changes
  - Loading states
- **Dependencies**: Supabase client, Next.js router

#### `components/BookmarkForm.tsx`
- **Type**: Client Component
- **Purpose**: Add new bookmarks
- **Features**:
  - URL validation
  - Optional title input
  - Error handling
  - Loading states
  - Auto-generates title from URL if not provided
- **Dependencies**: Supabase client

#### `components/BookmarkList.tsx`
- **Type**: Client Component
- **Purpose**: Display and manage bookmarks
- **Features**:
  - Real-time updates via Supabase
  - Delete functionality
  - Empty state
  - Loading skeleton
  - Relative time formatting
- **Dependencies**: Supabase client, real-time subscriptions

---

### Library Files

#### `lib/types.ts`
- **Purpose**: TypeScript type definitions
- **Exports**:
  - `Bookmark` interface
  - `User` interface
  - `Database` type
- **Used by**: All TypeScript files

#### `lib/supabase/client.ts`
- **Purpose**: Browser-side Supabase client
- **When to use**: Client Components
- **Creates**: Supabase client with proper configuration
- **Used by**: `AuthButton`, `BookmarkForm`, `BookmarkList`

#### `lib/supabase/server.ts`
- **Purpose**: Server-side Supabase client
- **When to use**: Server Components, Server Actions, Route Handlers
- **Handles**: Cookie-based session management
- **Used by**: `page.tsx`, `app/auth/callback/route.ts`

#### `lib/supabase/middleware.ts`
- **Purpose**: Session refresh utility
- **What it does**: Keeps user sessions fresh
- **Used by**: `middleware.ts`

---

### Middleware

#### `middleware.ts`
- **Purpose**: Runs before every request
- **What it does**:
  - Refreshes Supabase session
  - Sets/updates cookies
  - Ensures user stays logged in
- **Runs on**: Every page load
- **Critical**: Without this, users will be randomly logged out

---

### Routes

#### `app/auth/callback/route.ts`
- **Type**: Route Handler
- **Purpose**: OAuth callback endpoint
- **What it does**:
  - Receives auth code from Google
  - Exchanges code for Supabase session
  - Redirects user back to app
- **Called by**: Google OAuth after login

---

### Configuration Files

#### `next.config.ts`
- Next.js framework configuration
- Image optimization settings
- Build configuration

#### `tailwind.config.ts`
- Tailwind CSS configuration
- Custom colors, fonts, utilities
- Responsive breakpoints

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (`@/` = root)
- Strict type checking

---

### Documentation Files

#### `README.md`
- **Audience**: Everyone
- **Purpose**: Project overview, quick start
- **Length**: ~5 min read

#### `QUICKSTART.md`
- **Audience**: New users
- **Purpose**: 15-minute setup guide
- **Best for**: Getting started quickly

#### `DOCUMENTATION.md`
- **Audience**: Developers
- **Purpose**: Complete reference
- **Covers**: Architecture, setup, troubleshooting

#### `DEVELOPMENT.md`
- **Audience**: Contributors, developers
- **Purpose**: Extend the application
- **Covers**: How to add features, best practices

#### `DEPLOYMENT.md`
- **Audience**: Anyone deploying
- **Purpose**: Deploy to production
- **Covers**: Vercel, environment variables, domains

#### `TROUBLESHOOTING.md`
- **Audience**: Anyone facing issues
- **Purpose**: Fix common problems
- **Covers**: Auth, database, real-time issues

#### `CHECKLIST.md`
- **Audience**: New users
- **Purpose**: Track setup progress
- **Format**: Interactive checklist

---

## 🔄 Data Flow

### Authentication Flow
```
User clicks "Sign in"
    ↓
AuthButton → Google OAuth
    ↓
Google redirects to Supabase
    ↓
Supabase → app/auth/callback/route.ts
    ↓
Session created → Cookies set
    ↓
User redirected to homepage
    ↓
page.tsx checks session
    ↓
Shows bookmark manager
```

### Adding Bookmark Flow
```
User fills form → BookmarkForm
    ↓
Validates URL
    ↓
Gets current user ID
    ↓
Inserts to Supabase database
    ↓
RLS checks user_id matches
    ↓
Database insert successful
    ↓
Realtime broadcasts change
    ↓
BookmarkList receives update
    ↓
Updates UI in all open tabs
```

### Real-time Sync Flow
```
Tab 1: User adds bookmark
    ↓
Supabase Database updated
    ↓
Realtime engine broadcasts
    ↓
All subscribed tabs receive update
    ↓
Tab 2, Tab 3: UI updates automatically
```

---

## 🎯 Key Technologies

| File | Technology | Purpose |
|------|------------|---------|
| `*.tsx` | React + TypeScript | UI Components |
| `app/` | Next.js App Router | Framework |
| `lib/supabase/` | Supabase | Backend |
| `components/` | React Client Components | Interactive UI |
| `globals.css` | Tailwind CSS | Styling |
| `middleware.ts` | Next.js Middleware | Session management |

---

## 🚀 Build Process

When you run `npm run dev`:

1. Next.js starts development server
2. TypeScript compiles `.ts` and `.tsx` files
3. Tailwind processes CSS
4. Server Components render on server
5. Client Components hydrate in browser
6. Middleware runs on each request
7. Hot reload watches for file changes

When you run `npm run build`:

1. TypeScript compilation
2. Tailwind CSS optimization
3. Next.js optimization
4. Route pre-rendering
5. Static asset generation
6. Production bundle created

---

## 📝 Notes

### What's NOT in Git
- `node_modules/` - Too large, installed via `npm install`
- `.next/` - Build artifacts, regenerated each build
- `.env.local` - Contains secrets, NEVER commit this!

### What IS in Git
- All source code (`.ts`, `.tsx`)
- Configuration files
- Documentation
- `.env.example` - Template (no secrets)

---

## 🎓 Learning Path

**If you're new, read files in this order:**

1. `README.md` - Understand what the app does
2. `QUICKSTART.md` - Set up the project
3. `lib/types.ts` - Learn the data structure
4. `components/AuthButton.tsx` - Simple component
5. `components/BookmarkForm.tsx` - Form handling
6. `components/BookmarkList.tsx` - Real-time logic
7. `app/page.tsx` - How it all comes together
8. `DEVELOPMENT.md` - Build your own features!

---

**Questions? Check [DOCUMENTATION.md](./DOCUMENTATION.md) for complete details!**
