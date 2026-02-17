# 👨‍💻 Development Guide

This guide will help you understand the codebase and extend the application with new features.

## 📚 Understanding the Codebase

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AuthButton   │  │ BookmarkForm │  │ BookmarkList │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
│                    Supabase Client                           │
└───────────────────────────┼───────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Middleware   │ (Session Refresh)
                    └───────┬────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      Supabase Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Google OAuth │  │   Database   │  │   Realtime   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. `lib/supabase/client.ts`
**Purpose**: Browser-side Supabase client  
**When to use**: In Client Components (components with `'use client'`)  
**Example**:
```typescript
const supabase = createClient();
const { data } = await supabase.from('bookmarks').select();
```

#### 2. `lib/supabase/server.ts`
**Purpose**: Server-side Supabase client  
**When to use**: In Server Components, Server Actions, Route Handlers  
**Example**:
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

#### 3. `middleware.ts`
**Purpose**: Refreshes Supabase session on every request  
**Runs**: Before every page load  
**Important**: Keeps users logged in!

---

## 🎯 How to Add Features

### Feature 1: Add Categories/Folders

**1. Update Database**

```sql
-- Add category column
ALTER TABLE bookmarks ADD COLUMN category TEXT DEFAULT 'General';

-- Create categories table (optional advanced version)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. Update TypeScript Types**

```typescript
// lib/types.ts
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  category: string; // Add this
  created_at: string;
}
```

**3. Update BookmarkForm**

```typescript
// components/BookmarkForm.tsx
const [category, setCategory] = useState('General');

// In the form:
<select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option>General</option>
  <option>Work</option>
  <option>Personal</option>
</select>

// When inserting:
await supabase.from('bookmarks').insert({
  user_id: user.id,
  title,
  url,
  category, // Include category
});
```

**4. Update BookmarkList to Filter**

```typescript
const [selectedCategory, setSelectedCategory] = useState('All');

const filteredBookmarks = selectedCategory === 'All' 
  ? bookmarks 
  : bookmarks.filter(b => b.category === selectedCategory);
```

---

### Feature 2: Add Search Functionality

**1. Add Search State**

```typescript
// components/BookmarkList.tsx
const [searchQuery, setSearchQuery] = useState('');

const filteredBookmarks = bookmarks.filter(bookmark => 
  bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**2. Add Search UI**

```tsx
<input
  type="text"
  placeholder="Search bookmarks..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg"
/>
```

---

### Feature 3: Add Favorites

**1. Update Database**

```sql
ALTER TABLE bookmarks ADD COLUMN is_favorite BOOLEAN DEFAULT false;
CREATE INDEX bookmarks_favorite_idx ON bookmarks(user_id, is_favorite) WHERE is_favorite = true;
```

**2. Update Types**

```typescript
export interface Bookmark {
  // ... existing fields
  is_favorite: boolean;
}
```

**3. Add Toggle Function**

```typescript
const toggleFavorite = async (id: string, currentStatus: boolean) => {
  await supabase
    .from('bookmarks')
    .update({ is_favorite: !currentStatus })
    .eq('id', id);
};
```

**4. Add UI**

```tsx
<button onClick={() => toggleFavorite(bookmark.id, bookmark.is_favorite)}>
  {bookmark.is_favorite ? '⭐' : '☆'}
</button>
```

---

### Feature 4: Add Tags

**1. Create Tags Table**

```sql
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bookmark_id UUID REFERENCES bookmarks(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tags for their bookmarks"
ON tags
USING (
  bookmark_id IN (
    SELECT id FROM bookmarks WHERE user_id = auth.uid()
  )
);
```

**2. Update Bookmark Insert**

```typescript
// Insert bookmark
const { data: bookmark } = await supabase
  .from('bookmarks')
  .insert({ ... })
  .select()
  .single();

// Insert tags
const tags = ['react', 'tutorial', 'coding'];
await supabase
  .from('tags')
  .insert(tags.map(tag => ({ bookmark_id: bookmark.id, tag })));
```

---

## 🎨 Styling Guide

### Color Palette

```typescript
// Primary Colors
const colors = {
  primary: {
    blue: '#3B82F6',
    purple: '#9333EA',
  },
  secondary: {
    green: '#10B981',
    red: '#EF4444',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    800: '#1E293B',
    900: '#0F172A',
  }
};
```

### Adding Custom Animations

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};
```

---

## 🧪 Testing

### Manual Testing Checklist

Before pushing changes:

- [ ] Sign in works
- [ ] Sign out works
- [ ] Add bookmark works
- [ ] Delete bookmark works
- [ ] Real-time sync works (test in 2 tabs)
- [ ] Mobile responsive (use Chrome DevTools)
- [ ] No console errors
- [ ] UI looks good

### Adding Automated Tests (Advanced)

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

Example test:
```typescript
// components/__tests__/BookmarkForm.test.tsx
import { render, screen } from '@testing-library/react';
import BookmarkForm from '../BookmarkForm';

test('renders form with URL input', () => {
  render(<BookmarkForm />);
  const urlInput = screen.getByPlaceholderText(/https:\/\//i);
  expect(urlInput).toBeInTheDocument();
});
```

---

## 🐛 Debugging Tips

### 1. Use Browser DevTools

**View Network Requests**:
- Open DevTools (F12)
- Go to Network tab
- Filter by "Fetch/XHR"
- See all Supabase requests

**View Realtime Connection**:
- Network tab → WS (WebSocket)
- See real-time messages

### 2. Supabase Logs

- Go to Supabase Dashboard
- Navigate to "Logs"
- Filter by table or time
- See all database operations

### 3. Add Debug Logging

```typescript
// Add temporary logging
console.log('User:', user);
console.log('Bookmarks:', bookmarks);
console.log('Realtime payload:', payload);
```

---

## 📦 Useful npm Packages

### Icons
```bash
npm install lucide-react
```

```tsx
import { Star, Trash2, Plus } from 'lucide-react';

<button><Star className="w-5 h-5" /></button>
```

### Date Formatting
```bash
npm install date-fns
```

```typescript
import { formatDistanceToNow } from 'date-fns';

formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true });
// "2 hours ago"
```

### Toast Notifications
```bash
npm install sonner
```

```tsx
import { toast } from 'sonner';

toast.success('Bookmark added!');
toast.error('Failed to delete');
```

---

## 🚀 Performance Optimization

### 1. Optimize Images

```tsx
import Image from 'next/image';

<Image
  src={user.avatar_url}
  width={40}
  height={40}
  alt="Profile"
/>
```

### 2. Add Loading States

```tsx
const [loading, setLoading] = useState(false);

// Show skeleton while loading
{loading ? <Skeleton /> : <ActualContent />}
```

### 3. Memoize Expensive Calculations

```tsx
import { useMemo } from 'react';

const sortedBookmarks = useMemo(() => 
  bookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  [bookmarks]
);
```

---

## 📖 Best Practices

### 1. Component Organization

```typescript
// ✅ Good: Small, focused components
<BookmarkCard bookmark={bookmark} onDelete={handleDelete} />

// ❌ Bad: Everything in one component
<BookmarkList /> // 500 lines of code
```

### 2. Error Handling

```typescript
try {
  await supabase.from('bookmarks').insert(data);
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to add bookmark');
}
```

### 3. Type Safety

```typescript
// ✅ Use types
const bookmark: Bookmark = { ... };

// ❌ Avoid 'any'
const bookmark: any = { ... };
```

---

## 🎓 Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [Supabase Tutorials](https://supabase.com/docs/guides/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Patterns](https://patterns.dev/)

---

## 💡 Project Ideas

1. **Import/Export** - Export bookmarks as JSON/CSV
2. **Browser Extension** - Create a Chrome extension to save bookmarks
3. **Mobile App** - Build with React Native
4. **Public Lists** - Share bookmark collections
5. **Collections** - Group bookmarks into collections
6. **Analytics** - Track most visited bookmarks

---

**Happy coding! Build something amazing! 🚀**
