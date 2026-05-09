# 8thSense Production - React + Vite + Supabase

This project is now an 8thSense Production company website built with React, Vite, Tailwind CSS, Supabase Auth, Supabase Database, and Supabase Storage.

The main site showcases the company’s photography, videography, social media content creation, albums/portfolio, collaboration requests, feedback, quotation requests, and contact flow. A small authenticated Client Studio feature lets users post pictures.

## 1. Install

```bash
npm install
```

## 2. Environment

The app expects Vite environment variables:

```env
VITE_SUPABASE_URL=https://wsuheknajewlpexukwue.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
VITE_APP_URL=http://localhost:5173
```

Use only the Supabase publishable key in frontend env files. Never place service role keys or Google OAuth client secrets in `.env` or `.env.local`.

## 3. Supabase SQL

Run this file in Supabase SQL Editor:

```text
supabase/schema.sql
```

It creates:

- `profiles`
- `services`
- `portfolio_items`
- `sliders`
- `contacts`
- `feedback`
- `quotations`
- `collaboration_requests`
- `community_posts`
- `community_likes`
- Storage bucket: `community-posts`
- RLS policies and public insert policies for website forms
- Seed rows for services, sliders, and portfolio items

## 4. Google Login

In Google Console, use:

Authorized JavaScript origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Authorized redirect URI:

```text
https://wsuheknajewlpexukwue.supabase.co/auth/v1/callback
```

In Supabase Dashboard > Authentication > Providers > Google, paste your Google Client ID and Client Secret.

In Supabase Dashboard > Authentication > URL Configuration:

Site URL:

```text
http://localhost:5173
```

Redirect URLs:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:5173/studio
http://127.0.0.1:5173/studio
```

## 5. Run

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## 6. Build

```bash
npm run build
```

The production output is generated in `dist/`.
# 8thsense-reactjs
