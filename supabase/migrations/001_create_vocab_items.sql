create table if not exists public.vocab_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  vietnamese_meaning text,
  english_example text,
  quizlet_term text,
  quizlet_definition text,
  created_at timestamptz default now()
);

alter table public.vocab_items enable row level security;

create index if not exists vocab_items_user_created_at_idx
  on public.vocab_items (user_id, created_at desc);

create policy "Users can select own vocab items"
  on public.vocab_items
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own vocab items"
  on public.vocab_items
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vocab items"
  on public.vocab_items
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own vocab items"
  on public.vocab_items
  for delete
  using (auth.uid() = user_id);

create table if not exists public.vocab_generation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.vocab_generation_logs enable row level security;

create index if not exists vocab_generation_logs_user_created_at_idx
  on public.vocab_generation_logs (user_id, created_at desc);
