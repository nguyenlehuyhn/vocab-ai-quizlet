alter table public.vocab_items
  add column if not exists normalized_word text,
  add column if not exists is_starred boolean not null default false;

update public.vocab_items
set normalized_word = lower(btrim(word))
where normalized_word is null;

delete from public.vocab_items
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by user_id, lower(btrim(word))
        order by created_at asc, id asc
      ) as duplicate_rank
    from public.vocab_items
  ) ranked
  where duplicate_rank > 1
);

alter table public.vocab_items
  alter column normalized_word set not null;

create unique index if not exists vocab_items_user_normalized_word_key
  on public.vocab_items (user_id, normalized_word);
