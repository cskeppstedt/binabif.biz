# Setup Guide for binabif.biz

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Name: `binabif-waitlist` (or any name you prefer)
   - Database Password: (create a strong password and save it)
   - Region: Choose closest to your target audience
   - Pricing Plan: Free
5. Click "Create new project" (takes ~2 minutes to provision)

## Step 2: Create Database Table

Once your project is ready:

1. Go to the "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the SQL from `database/schema.sql` (we'll create this)
4. Click "Run" or press Cmd/Ctrl + Enter

## Step 3: Enable Row Level Security (RLS) Policies

The SQL script will set up RLS policies that:
- Allow anyone to INSERT new emails
- Allow anyone to READ the count of signups
- Prevent reading individual email addresses (privacy)

## Step 4: Get Your Supabase Credentials

1. Go to "Project Settings" (gear icon in sidebar)
2. Click "API" in the settings menu
3. Copy these values (you'll need them later):
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Publishable key** (new format: `sb_publishable_xxx`) - recommended for new projects
   - OR **anon public key** (legacy format: `eyJ...`) - still works if your project has it

**Note:** Newer Supabase projects use publishable keys (`sb_publishable_xxx`) which offer better security and rotation capabilities. Both work with the Supabase client - use whichever your project provides!

## Step 5: Update Frontend Configuration

Create a file called `config.js` with your credentials (we'll create a template).

---

**Next Steps:** After completing Supabase setup, we'll test the frontend locally, then deploy to Cloudflare Pages.
