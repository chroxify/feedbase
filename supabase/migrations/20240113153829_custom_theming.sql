create type "public"."theme_type" as enum ('default', 'light', 'custom');

drop policy "Enable update for authenticated users only" on "public"."feedback";

alter table "public"."project_configs" drop constraint "project_configs_project_id_fkey";

alter table "public"."project_configs" add column "custom_theme" theme_type not null default 'default'::theme_type;

alter table "public"."project_configs" add column "custom_theme_accent" text;

alter table "public"."project_configs" add column "custom_theme_background" text;

alter table "public"."project_configs" add column "custom_theme_border" text;

alter table "public"."project_configs" add column "custom_theme_primary_foreground" text;

alter table "public"."project_configs" add column "custom_theme_root" text;

alter table "public"."project_configs" add column "custom_theme_secondary_background" text;

alter table "public"."project_configs" add column "feedback_allow_anon_upvoting" boolean;

alter table "public"."project_configs" add constraint "project_configs_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."project_configs" validate constraint "project_configs_project_id_fkey";

create policy "Enable update for all users only"
on "public"."feedback"
as permissive
for update
to anon, authenticated
using (true)
with check (true);



