create extension if not exists "wrappers" with schema "extensions";


create type "public"."token_type" as enum ('full_access', 'public_access');

create table "public"."project_api_keys" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "permission" token_type not null,
    "token" text not null,
    "short_token" text not null,
    "created_at" timestamp with time zone not null default now(),
    "project_id" uuid not null,
    "creator_id" uuid not null
);


alter table "public"."project_api_keys" enable row level security;

CREATE UNIQUE INDEX project_api_keys_pkey ON public.project_api_keys USING btree (id);

alter table "public"."project_api_keys" add constraint "project_api_keys_pkey" PRIMARY KEY using index "project_api_keys_pkey";

alter table "public"."project_api_keys" add constraint "project_api_keys_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_api_keys" validate constraint "project_api_keys_creator_id_fkey";

alter table "public"."project_api_keys" add constraint "project_api_keys_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_api_keys" validate constraint "project_api_keys_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_allowed_api_token(apitoken text, tokentype token_type[])
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
Begin
  RETURN (SELECT EXISTS (SELECT 1
  FROM project_api_keys
  WHERE token=apitoken
  AND permission=ANY(tokentype)));
End;  
$function$
;

create policy "Allow API Access"
on "public"."changelogs"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));


create policy "Allow API Access"
on "public"."project_api_keys"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));


create policy "Enable delete for authenticated users only"
on "public"."project_api_keys"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."project_api_keys"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."project_api_keys"
as permissive
for select
to public
using (true);


create policy "Enable select for authenticated users only"
on "public"."project_api_keys"
as permissive
for select
to authenticated
using (true);


create policy "Allow API Access"
on "public"."project_configs"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));


create policy "Allow API Access"
on "public"."project_invites"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));


create policy "Allow API Access"
on "public"."project_members"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));


create policy "Allow API Access"
on "public"."projects"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::token_type[]));

create policy "API Access for Insert"
on "public"."feedback"
as permissive
for insert
to public
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access,full_access}'::token_type[]));

create policy "API Access for Update"
on "public"."profiles"
as permissive
for update
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::token_type[]));

create policy "API Access for Insert"
on "public"."profiles"
as permissive
for insert
to public
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::token_type[]));

alter table "public"."project_configs" add column "integration_sso_secret" text;

alter table "public"."project_configs" add column "integration_sso_status" boolean;

alter table "public"."project_configs" add column "integration_sso_url" text;