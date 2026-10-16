# Deploying "Manu" to Vercel 🚀

This application is fully prepared and pre-configured for one-click deployment on **Vercel** with:
- **Client Frontend**: React 19 + Vite + Tailwind CSS + Lucide Icons + Google Fonts
- **Backend API**: Vercel Serverless Function at `/api/generate` (`api/generate.ts`) powered by `@google/genai` (Gemini 3.8 Flash)
- **SPA Routing**: `vercel.json` rewrites for all client routes (`/`, `/dashboard`, `/create`, `/auth/login`, `/auth/signup`)

---

## Method 1: Deploy via GitHub (Recommended)

1. **Push this project to a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Manu"
   git remote add origin https://github.com/YOUR_USERNAME/manu-tamil-petition.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Framework Preset: **Vite** (Vercel detects this automatically).
   - Root Directory: `./` (leave default).
   - Build Command: `npm run build` (or `vite build`).
   - Output Directory: `dist` (default for Vite).

3. **Configure Environment Variables** in Vercel:
   - In the **Environment Variables** section, add:
     - `GEMINI_API_KEY`: Your Google Gemini API Key.
     - *(Optional)* Any custom Firebase keys (`VITE_FIREBASE_API_KEY`, etc. if you are using your own cloud Firebase project).

4. **Click "Deploy"**:
   - Vercel will build the frontend assets into `dist/` and compile the `/api/generate` serverless endpoint.
   - Your site will be live at `https://your-project-name.vercel.app`!

---

## Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variable via CLI**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Follow the prompts to enter your API key and set it for Production.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## Verifying the Deployment

Once deployed on Vercel:
1. Open your production URL (`https://your-app.vercel.app`).
2. Test the **Live Transformation Sample** or click **"Start New Petition"**.
3. Submit a Tanglish grievance to verify `/api/generate` produces court-ready Tamil and English drafts.
4. Test the **Print / A4 PDF** feature and **Voice Dictation**.
