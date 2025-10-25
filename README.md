# BINABIF - Mysterious Game Waitlist

A sleek, mysterious waitlist page for the upcoming BINABIF game.

## Tech Stack

- **Frontend:** Pure HTML, CSS, JavaScript
- **Backend:** Supabase (PostgreSQL + Functions)
- **Hosting:** Cloudflare Pages (free tier)

## Local Development

### 1. Set Up Supabase

Follow the instructions in `SETUP.md` to:
- Create a Supabase project
- Run the database schema from `database/schema.sql`
- Get your API credentials

### 2. Configure the App

```bash
# Copy the config template
cp config.example.js config.js

# Edit config.js and add your Supabase credentials
# Use the publishable key (sb_publishable_xxx) for newer projects
# or the anon key for legacy projects - both work!
```

### 3. Run Locally

Simply open `index.html` in your browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000`

## Deployment to Cloudflare Pages

### Option 1: Connect Git Repository (Recommended)

1. Push your code to GitHub (make sure config.js is in .gitignore!)
2. Go to https://dash.cloudflare.com/
3. Navigate to "Workers & Pages" > "Pages"
4. Click "Connect to Git"
5. Select your repository
6. Configure build settings:
   - **Build command:** Leave empty (static site)
   - **Build output directory:** `/`
7. Add environment variables:
   - Go to Settings > Environment Variables
   - Add your Supabase config as build variables (or use a different approach - see below)
8. Click "Save and Deploy"

**Important:** For config.js, you have two options:
- **Option A:** Add config.js manually to Cloudflare Pages after deployment using Cloudflare Workers
- **Option B:** Use environment variables and generate config.js during build (requires adding a build step)
- **Option C (Easiest):** Temporarily commit config.js, deploy, then remove it and add to .gitignore

### Option 2: Direct Upload

1. Go to https://dash.cloudflare.com/
2. Navigate to "Workers & Pages" > "Pages"
3. Click "Upload assets"
4. Make sure you have created `config.js` with your credentials
5. Drag and drop all files (index.html, styles.css, app.js, config.js)
6. Click "Deploy"

### Custom Domain

1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add `binabif.biz`
4. Follow DNS configuration instructions

## Features

- Clean, mysterious dark theme with glitch effects
- Real-time waitlist counter
- Email validation and deduplication
- Privacy-focused (emails not publicly readable)
- Fully responsive design
- No framework dependencies

## Database Schema

The `waitlist` table stores:
- `id`: Unique identifier (UUID)
- `email`: Normalized email (lowercase, trimmed)
- `created_at`: Signup timestamp

Security features:
- Row Level Security (RLS) enabled
- Public can insert (sign up)
- Public cannot read emails (privacy)
- Count function bypasses RLS for stats only

## License

Private project for BINABIF game.
