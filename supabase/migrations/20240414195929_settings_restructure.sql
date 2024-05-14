create type "public"."icon_radius_type" as enum ('rounded-full', 'rounded-none', 'rounded-md');

alter type "public"."theme_type" rename to "theme_type__old_version_to_be_dropped";

create type "public"."theme_type" as enum ('dark', 'light', 'custom');

drop type "public"."theme_type__old_version_to_be_dropped";

alter table "public"."project_configs" add column "project_icon" text;

alter table "public"."project_configs" add column "project_icon_radius" text not null default 'rounded-md'::text;

alter table "public"."project_configs" add column "project_og_image" text;

alter table "public"."projects" drop column "icon";

alter table "public"."projects" drop column "icon_radius";

alter table "public"."projects" drop column "og_image";


