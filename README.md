# Vocab AI Quizlet

Mobile-first vocabulary web app for English learners. Users sign in with Google, generate Vietnamese meanings and English examples with AI, save vocabulary to Supabase, browse saved words, star important words, delete old words, and copy Quizlet import text.

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

## Vocabulary Dashboard

The dashboard supports:

- Search across English word, Vietnamese meaning, and English example.
- Simple filters: Today, This week, This month, All, and Starred.
- Pronunciation in IPA style when available.
- Star action for marking important words.
- Delete action for removing words after confirmation.
- A horizontally scrollable table on small screens.

Duplicate prevention is enforced per user. Words are normalized by trimming spaces and comparing case-insensitively, so `hello`, `Hello`, and ` HELLO ` count as the same word.

Deleted words can be added again because dashboard deletion performs a verified hard delete through the server API before the word is considered gone.

## iPhone Home Screen Quick Add

For a fast daily capture flow:

1. Open `/app/quick-add` in Safari on your iPhone.
2. Tap Share.
3. Tap Add to Home Screen.
4. Use that home screen shortcut whenever you want to add a word quickly.

Quick Add is optimized for rapid entry. When you tap Add word, the input clears immediately and the word appears in a pending list while AI generation continues. Each pending word updates to Saved, Already exists, or Failed. Failed items include a Retry button.

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

The second migration adds duplicate prevention and starred words:

- `normalized_word` stores the trimmed lowercase word.
- `is_starred` stores starred status.
- A unique index on `user_id` and `normalized_word` prevents future duplicates.
- Existing duplicates are cleaned by keeping the oldest row for each user and normalized word before creating the unique index.

The third migration adds `pronunciation`, used for IPA-style pronunciation such as `/əˈfɪlieɪt/`. Existing rows without pronunciation display `-`.

## Quizlet Export

Go to `/app/export` after saving words. Choose Today, This week, This month, All, or Starred, then copy the generated text:

```text
term<TAB>definition
```

The term is the English front side. The definition does not repeat the English word; it contains only the Vietnamese meaning and English example:

```text
hello	xin chào. Example: Hello! How are you today.
success	thành công. Example: She worked hard and achieved great success.
```

Use the copy button and paste the text into Quizlet import.
