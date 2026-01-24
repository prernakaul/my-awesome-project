# Deployment Guide - AI Travel Agent

This guide walks you through deploying the AI Travel Agent app using **Railway** (backend) and **Vercel** (frontend).

---

## Prerequisites

- GitHub account (both platforms integrate with GitHub)
- Railway account: https://railway.app (free tier available)
- Vercel account: https://vercel.com (free tier available)

---

## Step 1: Push Code to GitHub

First, push the travel-agent-ui folder to a GitHub repository:

```bash
cd travel-agent-ui
git init
git add .
git commit -m "Initial commit - AI Travel Agent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/travel-agent-ui.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `travel-agent-ui` repository
4. Railway will detect the monorepo - select the **`server`** directory

### 2.2 Configure Environment Variables

In Railway dashboard, go to your service → **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `REDIS_HOST` | Your Redis host |
| `REDIS_PORT` | Your Redis port |
| `REDIS_PASSWORD` | Your Redis password |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (update after Vercel deploy) |
| `PORT` | `3002` |

### 2.3 Configure Build Settings

In **Settings** tab:
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 2.4 Deploy

Click **Deploy** and wait for the build to complete. Note your Railway URL (e.g., `https://travel-agent-server-production.up.railway.app`)

### 2.5 Verify Backend

Test the health endpoint:
```bash
curl https://YOUR-RAILWAY-URL.railway.app/api/health
```

You should see: `{"status":"ok","redis":"connected",...}`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"** → Import your `travel-agent-ui` repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root, not server)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Configure Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-api03-...` (your Anthropic API key) |
| `VITE_BACKEND_URL` | `https://YOUR-RAILWAY-URL.railway.app` |

**Important**: Prefix with `VITE_` for Vite to expose these to the frontend.

### 3.3 Deploy

Click **Deploy** and wait for the build. Note your Vercel URL (e.g., `https://travel-agent-ui.vercel.app`)

---

## Step 4: Update CORS Settings

Go back to Railway and update the `ALLOWED_ORIGINS` variable:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://travel-agent-ui.vercel.app
```

Redeploy the Railway service for changes to take effect.

---

## Step 5: Test the Deployment

1. Open your Vercel URL in a browser
2. Complete the onboarding flow
3. Verify the "Profile synced" indicator shows connected
4. Test commands like "show my preferences"
5. Request destination suggestions

---

## Troubleshooting

### "Profile synced" shows "Offline mode"
- Check Railway logs for Redis connection errors
- Verify CORS settings include your Vercel domain
- Check browser console for network errors

### API calls failing
- Verify `VITE_BACKEND_URL` is set correctly in Vercel
- Ensure Railway service is running (check Railway dashboard)
- Check that `ALLOWED_ORIGINS` includes your frontend domain

### Build failures on Vercel
- Ensure all dependencies are in `package.json`
- Check that TypeScript compiles without errors locally: `npm run build`

### Build failures on Railway
- Check the `server/` directory has its own `package.json`
- Verify `tsconfig.json` exists in the server directory
- Check Railway build logs for specific errors

---

## Environment Variables Summary

### Railway (Backend)
```
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
PORT=3002
```

### Vercel (Frontend)
```
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
VITE_BACKEND_URL=https://your-railway-domain.railway.app
```

---

## Custom Domain (Optional)

### Vercel
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

### Railway
1. Go to **Settings** → **Networking** → **Public Networking**
2. Add custom domain
3. Update DNS records as instructed

Remember to update `ALLOWED_ORIGINS` if you add custom domains!

---

## Costs

Both Railway and Vercel offer free tiers:

- **Vercel Free**: 100GB bandwidth/month, unlimited deployments
- **Railway Free**: $5 credit/month, ~500 hours of runtime

For production use with more traffic, consider:
- Vercel Pro: $20/month
- Railway Pro: $20/month
