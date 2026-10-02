# Deploying Retro to Vercel (Public URL)

Your project has been structured and configured for **Vercel Serverless & Static Deployment**.

---

## What Was Configured:
1. **[vercel.json](file:///c:/Users/plpan/Downloads/Retro/vercel.json)**:
   - Configures automatic routing for all HTML subpages (`/about`, `/menu`, `/contact`, `/services`, `/blog`, `/reviews`, `/cart`, etc.) with clean URLs.
   - Routes dynamic API requests (`/api/*`) directly to the serverless function.
   - Global CDN caching headers for assets (`css`, `js`, `image`).
2. **[api/index.js](file:///c:/Users/plpan/Downloads/Retro/api/index.js)**:
   - Dynamic serverless endpoints:
     - `GET /api/message` (Status & welcome)
     - `GET /api/health` (Service health check)
     - `GET /api/products` (Dynamic vintage catalog)
     - `POST /api/contact` (Live contact form handling)
     - `POST /api/newsletter` (Discount code & subscriber handling)
     - `GET /api/reviews` & `POST /api/reviews` (Customer reviews)
3. **Frontend Integration**:
   - Contact form ([html/contact.html](file:///c:/Users/plpan/Downloads/Retro/html/contact.html)) connects dynamically to `/api/contact`.
   - Discount popup ([js/popup.js](file:///c:/Users/plpan/Downloads/Retro/js/popup.js)) connects dynamically to `/api/newsletter`.

---

## Deployment Steps

### Method 1: Deploy with Vercel CLI (Fastest — 2 Minutes)

1. Open PowerShell in your project root:
   ```powershell
   cd c:\Users\plpan\Downloads\Retro
   ```

2. Run the Vercel deployment command:
   ```powershell
   npx vercel
   ```

3. Follow the short interactive prompts:
   - **Log in** to your Vercel account (free at [vercel.com](https://vercel.com)).
   - **Set up and deploy?** Press `y` (Enter).
   - **Which scope?** Select your account (Enter).
   - **Link to existing project?** Press `n` (Enter).
   - **What's your project's name?** `retro` (or your preferred name).
   - **In which directory is your code located?** Press Enter (`./`).
   - **Want to modify settings?** Press `n` (Enter).

4. To deploy directly to production with a permanent public URL:
   ```powershell
   npx vercel --prod
   ```

Vercel will print your live public URL, for example:
👉 **`https://retro-vintage.vercel.app`**

---

### Method 2: Deploy via GitHub (Automatic CI/CD)

1. **Commit and Push your project to GitHub**:
   ```bash
   git add .
   git commit -m "Configure dynamic Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Log in with GitHub.
   - Under **"Import Git Repository"**, select your **Retro** repository and click **Import**.
   - Leave Framework Preset as **Other** (Vercel automatically detects `vercel.json`).
   - Click **Deploy**.

3. In less than 60 seconds, your site will be deployed globally with a public `.vercel.app` URL and automatic HTTPS!
