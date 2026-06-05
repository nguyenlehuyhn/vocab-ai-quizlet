# Vocab AI Quizlet

Mobile-first vocabulary web app for English learners. Users sign in with Google, generate Vietnamese meanings and English examples with AI, save vocabulary to Supabase, browse saved words, and copy Quizlet import text.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- OpenAI Responses API through server-side routes only
- Vercel deployment target

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project.

3. In Supabase, enable Google OAuth under Authentication > Providers. Add your local and production callback URLs:

   ```text
   http://localhost:3000/auth/callback
   https://YOUR_VERCEL_DOMAIN/auth/callback
   ```

4. Run the SQL in `supabase/migrations/001_create_vocab_items.sql` from the Supabase SQL editor.

5. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000`.

## App Pages

- `/app` is the vocabulary dashboard. It shows saved words in a spreadsheet-style table with search and date filters.
- `/app/quick-add` is a focused add-only page for fast phone usage.
- `/app/export` exports filtered words in Quizlet import format.
- `/app/settings` shows account settings and sign out.

## iPhone Home Screen Quick Add

For a fast daily capture flow:

1. Open `/app/quick-add` in Safari on your iPhone.
2. Tap Share.
3. Tap Add to Home Screen.
4. Use that home screen shortcut whenever you want to add a word quickly.

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

`OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are used only on the server. Never expose them in client components.

## Vercel Deployment

1. Import this GitHub repo into Vercel.
2. Add the environment variables from `.env.example`.
3. Set the Supabase Google OAuth redirect URL to:

   ```text
   https://YOUR_VERCEL_DOMAIN/auth/callback
   ```

4. Deploy.

## Database

The migration creates `vocab_items`, enables Row Level Security, and adds policies so users can only select, insert, update, and delete their own rows.

## Quizlet Export

Go to `/app/export` after saving words. Choose a date filter, then copy the generated text:

```text
term<TAB>definition
```

Use the copy button and paste the text into Quizlet import.
