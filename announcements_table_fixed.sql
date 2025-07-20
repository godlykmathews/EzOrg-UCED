-- Create announcements table
create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  priority text default 'normal' check (priority in ('low', 'normal', 'high')),
  target_audience text default 'all' check (target_audience in ('all', 'students', 'faculty', 'staff')),
  created_by text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table announcements enable row level security;

-- Allow all authenticated users to read announcements
create policy "Anyone can view announcements" on announcements
  for select
  using (true);

-- Allow hod and principal roles to create announcements
create policy "HOD and Principal can create announcements" on announcements
  for insert
  with check (
    exists (
      select 1 from users 
      where users.id = auth.uid() 
      and users.role in ('hod', 'principal')
    )
  );

-- Allow announcement creators to update their own announcements
create policy "Creators can update their own announcements" on announcements
  for update
  using (created_by = (select email from auth.users where id = auth.uid()));

-- Allow hod and principal roles to delete announcements
create policy "HOD and Principal can delete announcements" on announcements
  for delete
  using (
    exists (
      select 1 from users 
      where users.id = auth.uid() 
      and users.role in ('hod', 'principal')
    )
  );

-- Create index for better performance
create index if not exists announcements_created_at_idx on announcements(created_at);
create index if not exists announcements_priority_idx on announcements(priority); 