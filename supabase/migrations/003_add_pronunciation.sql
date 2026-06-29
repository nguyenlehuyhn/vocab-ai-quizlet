alter table public.vocab_items
  add column if not exists pronunciation text;
