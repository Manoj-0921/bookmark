# 🔧 Troubleshooting Guide

Common issues and their solutions for the Smart Bookmark Manager.

## 🚨 Authentication Issues

### Issue: "Sign in with Google" button doesn't work

**Symptoms**:
- Button doesn't respond when clicked
- No redirect to Google
- Console shows errors

**Solutions**:

1. **Check Environment Variables**
   ```bash
   # Make sure .env.local exists and contains:
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
   
   ⚠️ **Important**: Restart dev server after changing `.env.local`
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

2. **Verify Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Check that redirect URI is correct:
     ```
     https://<YOUR_PROJECT>.supabase.co/auth/v1/callback
     ```
   - Make sure Google+ API is enabled

3. **Check Supabase Provider**
   - Supabase Dashboard → Authentication → Providers
   - Ensure Google is enabled
   - Client ID and Secret are correct

4. **Check Browser Console**
   - Press F12 to open DevTools
   - Look for red errors
   - Common error: "Provider not enabled" → Enable Google in Supabase

---

### Issue: Redirects to Google but fails to sign in

**Symptoms**:
- Successfully redirects to Google
- After selecting account, returns with error
- Stays on loading screen

**Solutions**:

1. **Check Callback Route**
   - Verify `app/auth/callback/route.ts` exists
   - Check for TypeScript errors

2. **Check Supabase Logs**
   - Supabase Dashboard → Logs → Auth Logs
   - Look for failed authentication attempts

3. **Clear Browser Cache**
   - Clear cookies and cache
   - Try in incognito/private mode

4. **Verify Redirect URI**
   - Must match EXACTLY in both Google Console and Supabase
   - No trailing slashes
   - Check for typos

---

### Issue: User signs in but immediately signs out

**Symptoms**:
- Flash of signed-in state
- Immediately logged out
- Have to sign in repeatedly

**Solutions**:

1. **Check Middleware**
   - Verify `middleware.ts` exists
   - Make sure it's exporting `config`

2. **Check Cookie Settings**
   - In production, make sure domain is correct
   - Check that cookies aren't being blocked

3. **Verify Session Handling**
   - Check `lib/supabase/server.ts` has correct cookie handling
   - Ensure `lib/supabase/middleware.ts` is calling `getUser()`

---

## 💾 Database Issues

### Issue: Bookmarks not appearing

**Symptoms**:
- Can add bookmarks but they don't show
- Empty state shows even with bookmarks in database
- Console errors about RLS

**Solutions**:

1. **Check RLS Policies**
   - Go to Supabase Dashboard → Database → Tables → bookmarks
   - Click on "RLS" tab
   - Should see 3-4 policies enabled
   - If missing, run `supabase-setup.sql` again

2. **Check if logged in**
   ```typescript
   // In browser console:
   const supabase = createClient();
   const { data: { user } } = await supabase.auth.getUser();
   console.log(user); // Should show user object
   ```

3. **Check Database Directly**
   - Supabase → Database → Table Editor → bookmarks
   - See if data exists
   - Check `user_id` matches your user

4. **Check Network Tab**
   - F12 → Network → Filter "fetch"
   - Look for bookmark queries
   - Check response (200 = success, 400+ = error)

---

### Issue: Can't delete bookmarks

**Symptoms**:
- Delete button doesn't work
- Bookmark stays after clicking delete
- Error in console

**Solutions**:

1. **Check RLS Delete Policy**
   ```sql
   -- In Supabase SQL Editor, verify this policy exists:
   SELECT * FROM pg_policies 
   WHERE tablename = 'bookmarks' 
   AND policyname = 'Users can delete their own bookmarks';
   ```

2. **Check BookmarkList Component**
   - Verify `handleDelete` function exists
   - Check that `eq('id', id)` is being called

3. **Check Console for Errors**
   - Look for "permission denied" errors
   - If so, RLS policy is missing or incorrect

---

## ⚡ Real-time Issues

### Issue: Real-time not working

**Symptoms**:
- Add bookmark in tab 1, doesn't appear in tab 2
- Have to refresh to see changes
- No WebSocket connection

**Solutions**:

1. **Enable Realtime in Supabase**
   - Database → Replication
   - Find `bookmarks` table
   - Make sure toggle is ON ✅

2. **Check Realtime Connection**
   - F12 → Network → WS (WebSocket)
   - Should see connection to Supabase
   - If not, check Supabase URL is correct

3. **Check Channel Subscription**
   - In `BookmarkList.tsx`, verify:
   ```typescript
   supabase
     .channel('bookmarks_channel')
     .on('postgres_changes', { ... })
     .subscribe()
   ```

4. **Check Browser Tab**
   - Some browsers limit WebSocket connections
   - Try fewer tabs
   - Try different browser

5. **Check Supabase Project Status**
   - Dashboard → Project Settings → General
   - Make sure project is not paused

---

## 🎨 UI/Styling Issues

### Issue: Styles not applying

**Symptoms**:
- Page looks unstyled
- Missing colors/spacing
- Plain HTML look

**Solutions**:

1. **Check Tailwind CSS Setup**
   ```bash
   # Verify these files exist:
   ls tailwind.config.ts
   ls postcss.config.mjs
   ```

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Check Import**
   - In `app/layout.tsx`, verify:
   ```typescript
   import "./globals.css";
   ```

4. **Clear .next Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Issue: Components look broken on mobile

**Symptoms**:
- Layout breaks on small screens
- Text overlaps
- Buttons too small

**Solutions**:

1. **Test with DevTools**
   - F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Test different screen sizes

2. **Check Responsive Classes**
   - Should use `sm:`, `md:`, `lg:` prefixes
   - Example: `grid sm:grid-cols-2 lg:grid-cols-3`

3. **Add Meta Viewport**
   - Already in `layout.tsx`, but verify:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

---

## 🚀 Performance Issues

### Issue: App is slow to load

**Symptoms**:
- Long white screen before content appears
- Slow to respond
- Lag when typing

**Solutions**:

1. **Check Network Speed**
   - F12 → Network → Check load times
   - Slow? Might be internet connection

2. **Optimize Images**
   - Use Next.js `<Image>` component
   - Already done for profile pictures

3. **Check Database Query**
   - Excessive data? Add pagination
   - Too many bookmarks? Implement pagination

4. **Check for Infinite Loops**
   - Look at Components → Hook updates
   - Verify `useEffect` dependencies

---

## 🏗️ Build Issues

### Issue: Build fails with TypeScript errors

**Symptoms**:
- `npm run build` fails
- Type errors in console

**Solutions**:

1. **Check Types**
   ```bash
   npx tsc --noEmit
   ```

2. **Fix Type Errors**
   - Read error messages carefully
   - Add proper types
   - Fix any `any` types

3. **Update Dependencies**
   ```bash
   npm update
   ```

---

### Issue: Environment variables not working in production

**Symptoms**:
- Works locally but not on Vercel/production
- Can't connect to Supabase

**Solutions**:

1. **Check Vercel Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Make sure all variables are set
   - Must include `NEXT_PUBLIC_` prefix

2. **Redeploy**
   - After adding env vars, redeploy:
   - Settings → Deployments → Redeploy

---

## 🌐 Deployment Issues

### Issue: "Application error" on Vercel

**Symptoms**:
- Deployment succeeds but app shows error
- Build successful but runtime fails

**Solutions**:

1. **Check Vercel Function Logs**
   - Vercel → Deployment → Runtime Logs
   - Look for error messages

2. **Check Environment Variables**
   - Must be set in Vercel dashboard
   - Restart needed after changes

3. **Check for Server Errors**
   - Look at `app/page.tsx`
   - Verify all imports are correct

---

## 🔍 Debugging Steps

### General Debugging Workflow:

1. **Check Browser Console** (F12)
   - Any red errors?
   - What's the error message?

2. **Check Network Tab**
   - Are requests succeeding?
   - What's the response code?

3. **Check Supabase Logs**
   - Dashboard → Logs
   - Filter by time
   - Look for failed queries

4. **Check Environment Variables**
   ```bash
   # In terminal:
   echo $NEXT_PUBLIC_SUPABASE_URL
   
   # Should output your Supabase URL
   # If empty, .env.local isn't loaded
   ```

5. **Test in Incognito Mode**
   - Rules out cache issues
   - Fresh session

6. **Check Supabase Status**
   - [status.supabase.com](https://status.supabase.com)
   - Make sure services are up

---

## 📞 Getting Help

Still stuck? Here's what to include when asking for help:

### Information to Provide:

1. **Error Message**
   - Full error from console
   - Screenshot if needed

2. **What You Tried**
   - Steps you've already taken
   - What changed before it broke

3. **Environment**
   - Local or Production?
   - Browser version
   - Operating system

4. **Relevant Code**
   - File where error occurs
   - Recent changes

### Where to Get Help:

- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)
- [Stack Overflow](https://stackoverflow.com) (tag: nextjs, supabase)
- GitHub Issues (if using this as a template)

---

## 🎓 Prevention Tips

**To avoid issues:**

1. ✅ **Always test after changes**
   - Test in browser after every feature
   - Check both desktop and mobile

2. ✅ **Use TypeScript**
   - Catches errors before runtime
   - Better developer experience

3. ✅ **Test auth flow completely**
   - Sign in → Add bookmark → Sign out → Sign in again

4. ✅ **Keep dependencies updated**
   ```bash
   npm outdated  # Check for updates
   npm update    # Update packages
   ```

5. ✅ **Use version control**
   ```bash
   git commit -m "Working version before changes"
   # Make changes
   # If broken, can always revert
   ```

---

**Most issues can be solved by:**
1. Checking browser console
2. Restarting dev server
3. Verifying environment variables
4. Checking Supabase configuration

Good luck! 🚀
