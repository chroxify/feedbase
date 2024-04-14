create type "public"."icon_radius_type" as enum ('rounded-full', 'rounded-none', 'rounded-md');

alter table "public"."project_configs" alter column "custom_theme" drop default;

alter type "public"."theme_type" rename to "theme_type__old_version_to_be_dropped";

create type "public"."theme_type" as enum ('dark', 'light', 'custom');

alter table "public"."project_configs" alter column custom_theme type "public"."theme_type" using custom_theme::text::"public"."theme_type";

alter table "public"."project_configs" alter column "custom_theme" set default 'default'::theme_type;

drop type "public"."theme_type__old_version_to_be_dropped";

alter table "public"."project_configs" add column "project_icon" text;

alter table "public"."project_configs" add column "project_icon_radius" text not null default 'rounded-md'::text;

alter table "public"."project_configs" add column "project_og_image" text;

alter table "public"."project_configs" alter column "custom_theme" set default 'dark'::theme_type;

alter table "public"."projects" drop column "icon";

alter table "public"."projects" drop column "icon_radius";

alter table "public"."projects" drop column "og_image";


