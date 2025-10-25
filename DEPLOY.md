# Deployment Guide - Cloudflare Pages

## Prerequisites

- [ ] Supabase project created and configured (see SETUP.md)
- [ ] Database schema deployed (`database/schema.sql`)
- [ ] Local testing completed
- [ ] GitHub repository created (optional, for Git-based deployment)

## Quick Deploy Steps

### Step 1: Prepare Your Config

Create `config.js` with your Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co',
  anonKey: 'sb_publishable_xxx'  // Use publishable key (new) or anon key (legacy)
};
```

**Note:** Newer Supabase projects use publishable keys (`sb_publishable_xxx`). Legacy projects may still use anon keys (`eyJ...`). Both work with the Supabase client library!

### Step 2: Choose Deployment Method

#### Method A: Direct Upload (Easiest, 5 minutes)

1. Go to https://dash.cloudflare.com/
2. Sign up/login with your account
3. Click "Workers & Pages" in the left sidebar
4. Click "Create application" > "Pages" > "Upload assets"
5. Name your project: `binabif-waitlist`
6. Drag and drop these files:
   - index.html
   - styles.css
   - app.js
   - config.js (with your real credentials)
7. Click "Deploy site"
8. Done! You'll get a URL like: `https://binabif-waitlist.pages.dev`

**Pros:** Super fast, no git required
**Cons:** Manual updates (re-upload files each time)

#### Method B: Git Integration (Recommended for ongoing updates)

1. **Prepare Git Repository:**
```bash
# Make sure config.js is NOT committed
git status  # config.js should not appear (it's in .gitignore)

# Commit and push your code
git add .
git commit -m "Initial commit: waitlist page"
git push origin main
```

2. **Deploy on Cloudflare:**
   - Go to https://dash.cloudflare.com/
   - Click "Workers & Pages" > "Create application" > "Pages"
   - Click "Connect to Git"
   - Authorize GitHub and select your repository
   - Configure build settings:
     - **Project name:** `binabif-waitlist`
     - **Production branch:** `main`
     - **Build command:** (leave empty)
     - **Build output directory:** `/`
   - Click "Save and Deploy"

3. **Add Config as Environment Variable:**

   Since config.js is not in Git, we need to create it during deployment:

   - In your Cloudflare Pages project, go to "Settings" > "Environment variables"
   - Click "Add variables"
   - Add these variables:
     - `SUPABASE_URL`: `https://your-project-id.supabase.co`
     - `SUPABASE_ANON_KEY`: `your-anon-key`

   Then create a simple build script (optional advanced step) or use **Method C** below.

#### Method C: Git + Temporary Config Commit (Pragmatic Approach)

If you want Git deployment but don't want to deal with build scripts:

1. **Temporarily add config.js:**
```bash
# Remove config.js from .gitignore temporarily
nano .gitignore  # Comment out the config.js line

# Create config.js with your credentials
cp config.example.js config.js
# Edit config.js with real values

# Commit it
git add config.js
git commit -m "Add config for deployment"
git push
```

2. **Deploy via Cloudflare (same as Method B)**

3. **Remove config.js from git after deployment:**
```bash
# Restore .gitignore
nano .gitignore  # Uncomment config.js

# Remove from git but keep local file
git rm --cached config.js
git commit -m "Remove config from git"
git push
```

### Step 3: Custom Domain Setup

1. In your Cloudflare Pages project, click "Custom domains"
2. Click "Set up a custom domain"
3. Enter: `binabif.biz` and `www.binabif.biz`
4. If your domain is on Cloudflare DNS:
   - It will auto-configure (easiest!)
5. If your domain is elsewhere:
   - Add CNAME record: `binabif.biz` → `binabif-waitlist.pages.dev`
   - Add CNAME record: `www` → `binabif-waitlist.pages.dev`

### Step 4: Test Your Deployment

1. Visit your Cloudflare Pages URL
2. Check that the counter loads
3. Try signing up with a test email
4. Verify the counter increments
5. Try signing up again with same email (should get error)

## Troubleshooting

### "Configuration error" message
- Check that config.js exists and has correct values
- Verify SUPABASE_CONFIG variable is defined
- Check browser console for errors

### Counter shows "?"
- Verify database schema is deployed
- Check Supabase project is running
- Verify RPC function `get_waitlist_count` exists
- Check browser console for API errors

### Email signup fails
- Verify `add_to_waitlist` function exists in Supabase
- Check RLS policies are configured correctly
- Verify anon key has correct permissions

### CORS errors
- Supabase should handle CORS automatically
- Verify you're using the correct anon key (not service key)

## Updates and Redeployment

### For Direct Upload:
- Make changes locally
- Re-upload files to Cloudflare Pages
- Old deployment is replaced

### For Git Integration:
```bash
# Make changes
git add .
git commit -m "Update waitlist page"
git push
# Cloudflare auto-deploys!
```

## Performance Tips

- Cloudflare Pages automatically provides:
  - Global CDN
  - Automatic SSL
  - DDoS protection
  - Fast edge network
- No additional configuration needed!

## Security Notes

- ✅ Config.js contains only PUBLIC anon key (safe for frontend)
- ✅ RLS policies protect email data
- ✅ Supabase validates all inputs
- ✅ HTTPS enforced by default
- ⚠️ Never commit service_role key (we don't use it)

---

**You're done!** Your mysterious waitlist is now live and ready to build hype for BINABIF!
