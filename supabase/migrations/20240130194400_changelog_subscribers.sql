create table "public"."changelog_subscribers" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."changelog_subscribers" enable row level security;

CREATE UNIQUE INDEX changelog_subscribers_pkey ON public.changelog_subscribers USING btree (id);

alter table "public"."changelog_subscribers" add constraint "changelog_subscribers_pkey" PRIMARY KEY using index "changelog_subscribers_pkey";

alter table "public"."changelog_subscribers" add constraint "changelog_subscribers_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."changelog_subscribers" validate constraint "changelog_subscribers_project_id_fkey";

create policy "Enable insert for everyone"
on "public"."changelog_subscribers"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."changelog_subscribers"
as permissive
for select
to public
using (true);

create policy "Enable delete access for all users"
on "public"."changelog_subscribers"
as permissive
for delete
to public
using (true);