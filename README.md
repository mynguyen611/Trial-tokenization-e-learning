# Datavant Trial Tokenization Course
## Step-by-step hosting guide

---

## What you'll set up
- **Clerk** — handles login (restricts to @datavant.com emails)
- **GitHub** — stores your code (edit here to update the course)
- **Vercel** — hosts it live at a public URL, auto-deploys on every change

Total time: ~20 minutes. No coding required.

---

## STEP 1 — Create your Clerk account (5 min)

Clerk handles who can log in to the course.

1. Go to **[clerk.com](https://clerk.com)** → click **"Start building for free"**
2. Sign up with your email
3. Click **"Create application"**
4. Name it `Datavant Course` → choose **Email** as the sign-in method → click **Create**
5. You'll land on the application dashboard. On the left sidebar click **"API Keys"**
6. Copy the **Publishable key** — it looks like `pk_live_XXXXXXXXXXXXXX`
   - 📋 **Save this — you'll need it in Step 3**

### Restrict to @datavant.com emails only
1. In the Clerk dashboard left sidebar → click **"Restrictions"**
2. Under **"Allowlist"** → enable it → click **"Add email address"**
3. Type `+@datavant.com` (the + means wildcard — any datavant.com email)
4. Click **Save**

Now only people with a @datavant.com email can sign up.

---

## STEP 2 — Upload to GitHub (3 min)

GitHub stores your code. You'll edit files here to update the course.

1. Go to **[github.com](https://github.com)** → sign up / log in (free)
2. Click the **"+"** in the top right → **"New repository"**
3. Name it `datavant-course`
4. Set visibility to **Public** (required for free Vercel)
5. Click **"Create repository"**
6. On the next screen, click **"uploading an existing file"**
7. **Unzip** the `datavant-course.zip` file on your computer
8. Drag the **contents of the folder** (not the folder itself) into the GitHub upload area
   - You should see: `package.json`, `vite.config.js`, `index.html`, `README.md`, and a `src/` folder
9. Click **"Commit changes"**

---

## STEP 3 — Deploy on Vercel (5 min)

Vercel turns your GitHub code into a live website.

1. Go to **[vercel.com](https://vercel.com)** → click **"Sign Up"** → choose **"Continue with GitHub"**
2. Click **"Add New Project"**
3. Find `datavant-course` in the list → click **"Import"**
4. **Before clicking Deploy** — find the **"Environment Variables"** section and add:
   - Name: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: paste the Publishable key you copied from Clerk in Step 1
   - Click **"Add"**
5. Now click **"Deploy"**
6. Wait ~30 seconds → you'll see a success screen with your live URL

   Your URL will look like: `datavant-course.vercel.app`

---

## STEP 4 — Add your Vercel URL to Clerk (2 min)

Clerk needs to know your site's URL to allow redirects after login.

1. Go back to your **Clerk dashboard** → click **"Domains"** in the left sidebar
2. Click **"Add domain"**
3. Paste your Vercel URL (e.g. `datavant-course.vercel.app`) → click **Save**

---

## STEP 5 — Test it

1. Open your Vercel URL in an incognito window
2. You should see the Datavant-branded login screen
3. Sign up with your @datavant.com email
4. You'll receive a verification email → click the link → you're in
5. Share the URL with your sales reps — they sign up with their @datavant.com email on first visit

---

## HOW TO UPDATE THE COURSE

Whenever you want to fix content, update quiz questions, or change value numbers:

1. Go to your repository on **github.com/YOUR-USERNAME/datavant-course**
2. Click on **`src`** folder → click **`App.jsx`**
3. Click the **✏️ pencil icon** (top right of the file)
4. Make your changes
5. Scroll down → click **"Commit changes"** → **"Commit directly to main"** → **Commit**
6. Vercel detects the change and **auto-rebuilds in ~30 seconds** — the live URL updates automatically

### Finding content to edit in App.jsx
All course content lives in the `MODULES` array and `USE_CASES` array near the top of the file.

| What you want to change | Search for |
|---|---|
| Use case overview text | `"Long-Term Follow-Up"` / `"Trial Representativeness"` etc |
| Quiz questions | `quizzes:` under each use case |
| Value numbers ($2–15M etc) | `rev:` and `cost:` under `value:` |
| Why RWD Linkage text | `rwdWhy:` under each use case |
| Sales playbook tips | `salesTip:` under each use case |
| Problem bullets | `challenges:` under each use case |
| Without/With Datavant bullets | `without:` and `with:` under each use case |

---

## FILE REFERENCE

| File | What it does | Edit? |
|---|---|---|
| `src/App.jsx` | The entire course — all content and UI | ✅ Yes — this is your content file |
| `src/main.jsx` | Auth gate — Clerk login logic | Only if changing auth settings |
| `index.html` | HTML shell | ❌ No |
| `package.json` | Dependencies list | ❌ No |
| `vite.config.js` | Build settings | ❌ No |
