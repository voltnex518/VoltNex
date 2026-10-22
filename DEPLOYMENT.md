# VoltNex Production Deployment Guide

This guide covers everything required to deploy **VoltNex** to production on **Vercel**, **Netlify**, or **Cloudflare Pages**, along with configuring your production Supabase database and custom domain.

---

## 1. Pre-Deployment Verification Checklist

Before pushing to production, verify your local build and test suite:

```bash
# 1. Run unit test suite
npm run test

# 2. Run linter
npm run lint

# 3. Test production build and type checking
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 2. Deploying to Vercel (Recommended)

VoltNex is pre-configured for Vercel with single-page app (SPA) rewrites, HTTP security headers, and asset caching in [`vercel.json`](file:///c:/VoltNex/vercel.json).

### Option A: Using the Vercel Dashboard (Zero Terminal Required)
1. Push your VoltNex repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: prepare production deployment configuration"
   git branch -M main
   git remote add origin https://github.com/<your-username>/voltnex.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
3. Import your `voltnex` repository.
4. In the **Project Configuration** screen:
   * **Framework Preset**: `Vite` (auto-detected)
   * **Root Directory**: `./`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Expand **Environment Variables** and add the following 3 variables:

   | Variable Key | Production Value | Source |
   | :--- | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://vnxjyaienunezgezhaiv.supabase.co` | Supabase Dashboard > Settings > API |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_...` *(or your JWT anon key)* | Supabase Dashboard > Settings > API |
   | `VITE_ENABLE_DEMO_DATA` | `false` | Disables local offline demo store |

6. Click **Deploy**. Vercel will build and assign you a free HTTPS URL like `https://voltnex.vercel.app`.

### Option B: Using the Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```
When prompted:
* Set up and deploy: **Yes**
* Which scope: **Your personal/team account**
* Link to existing project: **No**
* Project name: `voltnex`
* Directory: `./`
* Modify settings: **No**

To deploy to production with environment variables:
```bash
vercel --prod -e VITE_SUPABASE_URL=https://vnxjyaienunezgezhaiv.supabase.co -e VITE_SUPABASE_ANON_KEY=<your-key> -e VITE_ENABLE_DEMO_DATA=false
```

---

## 3. Deploying to Netlify

VoltNex includes [`public/_redirects`](file:///c:/VoltNex/public/_redirects) and [`public/_headers`](file:///c:/VoltNex/public/_headers) for full Netlify SPA routing and security header compliance.

1. Push your repository to GitHub.
2. Go to [Netlify Dashboard](https://app.netlify.com/) > **Add new site** > **Import an existing project**.
3. Select GitHub and choose your `voltnex` repository.
4. Build settings:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
5. Click **Add environment variables** and enter:
   * `VITE_SUPABASE_URL` = `https://vnxjyaienunezgezhaiv.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `sb_publishable_...`
   * `VITE_ENABLE_DEMO_DATA` = `false`
6. Click **Deploy site**.

---

## 4. Supabase Production Security Configuration

After your site is deployed and has a live URL (e.g., `https://voltnex.vercel.app`):

### 1. Update Auth Site URL & Redirect URLs
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** > **URL Configuration**.
3. Under **Site URL**, change `http://localhost:5173` to your production URL:
   ```
   https://voltnex.vercel.app
   ```
4. Under **Redirect URLs**, add:
   ```
   https://voltnex.vercel.app/**
   https://voltnex.vercel.app/admin/login
   ```
5. Click **Save**.

### 2. Verify Storage Bucket Public URLs
1. Go to **Storage** > **Buckets**.
2. Verify both buckets are listed:
   * `project-media` (Public)
   * `project-downloads` (Public)
3. Under policies, confirm `Public Read Access for Media` is enabled.

---

## 5. Custom Domain Configuration (e.g. `voltnex.com`)

1. In Vercel (or Netlify), go to **Project Settings** > **Domains**.
2. Enter your domain (e.g. `voltnex.com` or `www.voltnex.com`).
3. Add the DNS records provided by your hosting provider in your domain registrar (GoDaddy, Namecheap, Cloudflare):
   * **Type A**: `@` -> `76.76.21.21` (for Vercel)
   * **Type CNAME**: `www` -> `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically within 2–5 minutes.
5. In Supabase Authentication URL Configuration, update **Site URL** to `https://voltnex.com`.

---

## 6. Accessing the Admin Portal in Production

1. Visit `https://your-domain.com/admin/login`.
2. Sign in with:
   * **Email**: `voltnex518@gmail.com`
   * **Password**: *(Your Supabase owner password)*
3. You now have full management capability over projects, tutorials, downloadable resources, site metadata, and visitor submissions.
