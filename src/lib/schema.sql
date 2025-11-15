-- Run this in your Supabase SQL Editor to create the required tables

create table workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled',
  nodes jsonb default '[]'::jsonb,
  edges jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_name text not null,
  status text not null default 'success',
  started_at timestamptz default now(),
  duration text default '0s'
);

-- Index for faster queries
create index idx_workflows_user_id on workflows(user_id);
create index idx_workflows_updated_at on workflows(updated_at desc);
create index idx_runs_user_id on runs(user_id);
create index idx_runs_started_at on runs(started_at desc);

-- Enable RLS
alter table workflows enable row level security;
alter table runs enable row level security;

-- RLS policies
create policy "Users can view their own workflows"
  on workflows for select
  using (auth.uid() = user_id);

create policy "Users can create their own workflows"
  on workflows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workflows"
  on workflows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workflows"
  on workflows for delete
  using (auth.uid() = user_id);

create policy "Users can view their own runs"
  on runs for select
  using (auth.uid() = user_id);

create policy "Users can create their own runs"
  on runs for insert
  with check (auth.uid() = user_id);
