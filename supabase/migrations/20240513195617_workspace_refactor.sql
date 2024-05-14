create type "public"."api_token_type" as enum ('full_access', 'public_access');

create type "public"."notification_type" as enum ('comment', 'post');

create type "public"."status_type" as enum ('in review', 'planned', 'in progress', 'completed', 'rejected');

drop policy "Enable delete access for all users" on "public"."changelog_subscribers";

drop policy "Enable insert for everyone" on "public"."changelog_subscribers";

drop policy "Enable read access for all users" on "public"."changelog_subscribers";

drop policy "Allow API Access" on "public"."changelogs";

drop policy "Enable delete for authenticated users only" on "public"."changelogs";

drop policy "Enable insert for authenticated users only" on "public"."changelogs";

drop policy "Enable read access for all users" on "public"."changelogs";

drop policy "Enable update for authenticated users only" on "public"."changelogs";

drop policy "Enable delete for authenticated users only" on "public"."feedback_comments";

drop policy "Enable insert for authenticated users only" on "public"."feedback_comments";

drop policy "Enable read access for all users" on "public"."feedback_comments";

drop policy "Enable update for authenticated users only" on "public"."feedback_comments";

drop policy "Enable insert for authenticated users only" on "public"."feedback_tags";

drop policy "Enable read access for all users" on "public"."feedback_tags";

drop policy "Enable update for authenticated users only" on "public"."feedback_tags";

drop policy "Enable delete for authenticated users only" on "public"."feedback_upvoters";

drop policy "Enable insert for authenticated users only" on "public"."feedback_upvoters";

drop policy "Enable read access for all users" on "public"."feedback_upvoters";

drop policy "Enable insert for authenticated users only" on "public"."notifications";

drop policy "Enable read for authenticated users only" on "public"."notifications";

drop policy "Enable update for authenticated users only" on "public"."notifications";

drop policy "API Access for Insert" on "public"."profiles";

drop policy "API Access for Update" on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Allow API Access" on "public"."project_api_keys";

drop policy "Enable delete for authenticated users only" on "public"."project_api_keys";

drop policy "Enable insert for authenticated users only" on "public"."project_api_keys";

drop policy "Enable read access for all users" on "public"."project_api_keys";

drop policy "Enable select for authenticated users only" on "public"."project_api_keys";

drop policy "Allow API Access" on "public"."project_configs";

drop policy "Enable insert for authenticated users only" on "public"."project_configs";

drop policy "Enable read access for all users" on "public"."project_configs";

drop policy "Enable update for authenticated users only" on "public"."project_configs";

drop policy "Allow API Access" on "public"."project_invites";

drop policy "Enable delete for authenticated users only" on "public"."project_invites";

drop policy "Enable insert for authenticated users only" on "public"."project_invites";

drop policy "Enable read access for all users" on "public"."project_invites";

drop policy "Enable update for authenticated users only" on "public"."project_invites";

drop policy "Allow API Access" on "public"."project_members";

drop policy "Enable insert for authenticated users only" on "public"."project_members";

drop policy "Enable read access for all users" on "public"."project_members";

drop policy "Allow API Access" on "public"."projects";

drop policy "Enable delete for authenticated users only" on "public"."projects";

drop policy "Enable insert for authenticated users only" on "public"."projects";

drop policy "Enable read access for all users" on "public"."projects";

drop policy "Enable update for authenticated users only" on "public"."projects";

drop policy "API Access for Insert" on "public"."feedback";

revoke delete on table "public"."changelog_subscribers" from "anon";

revoke insert on table "public"."changelog_subscribers" from "anon";

revoke references on table "public"."changelog_subscribers" from "anon";

revoke select on table "public"."changelog_subscribers" from "anon";

revoke trigger on table "public"."changelog_subscribers" from "anon";

revoke truncate on table "public"."changelog_subscribers" from "anon";

revoke update on table "public"."changelog_subscribers" from "anon";

revoke delete on table "public"."changelog_subscribers" from "authenticated";

revoke insert on table "public"."changelog_subscribers" from "authenticated";

revoke references on table "public"."changelog_subscribers" from "authenticated";

revoke select on table "public"."changelog_subscribers" from "authenticated";

revoke trigger on table "public"."changelog_subscribers" from "authenticated";

revoke truncate on table "public"."changelog_subscribers" from "authenticated";

revoke update on table "public"."changelog_subscribers" from "authenticated";

revoke delete on table "public"."changelog_subscribers" from "service_role";

revoke insert on table "public"."changelog_subscribers" from "service_role";

revoke references on table "public"."changelog_subscribers" from "service_role";

revoke select on table "public"."changelog_subscribers" from "service_role";

revoke trigger on table "public"."changelog_subscribers" from "service_role";

revoke truncate on table "public"."changelog_subscribers" from "service_role";

revoke update on table "public"."changelog_subscribers" from "service_role";

revoke delete on table "public"."changelogs" from "anon";

revoke insert on table "public"."changelogs" from "anon";

revoke references on table "public"."changelogs" from "anon";

revoke select on table "public"."changelogs" from "anon";

revoke trigger on table "public"."changelogs" from "anon";

revoke truncate on table "public"."changelogs" from "anon";

revoke update on table "public"."changelogs" from "anon";

revoke delete on table "public"."changelogs" from "authenticated";

revoke insert on table "public"."changelogs" from "authenticated";

revoke references on table "public"."changelogs" from "authenticated";

revoke select on table "public"."changelogs" from "authenticated";

revoke trigger on table "public"."changelogs" from "authenticated";

revoke truncate on table "public"."changelogs" from "authenticated";

revoke update on table "public"."changelogs" from "authenticated";

revoke delete on table "public"."changelogs" from "service_role";

revoke insert on table "public"."changelogs" from "service_role";

revoke references on table "public"."changelogs" from "service_role";

revoke select on table "public"."changelogs" from "service_role";

revoke trigger on table "public"."changelogs" from "service_role";

revoke truncate on table "public"."changelogs" from "service_role";

revoke update on table "public"."changelogs" from "service_role";

revoke delete on table "public"."feedback_comments" from "anon";

revoke insert on table "public"."feedback_comments" from "anon";

revoke references on table "public"."feedback_comments" from "anon";

revoke select on table "public"."feedback_comments" from "anon";

revoke trigger on table "public"."feedback_comments" from "anon";

revoke truncate on table "public"."feedback_comments" from "anon";

revoke update on table "public"."feedback_comments" from "anon";

revoke delete on table "public"."feedback_comments" from "authenticated";

revoke insert on table "public"."feedback_comments" from "authenticated";

revoke references on table "public"."feedback_comments" from "authenticated";

revoke select on table "public"."feedback_comments" from "authenticated";

revoke trigger on table "public"."feedback_comments" from "authenticated";

revoke truncate on table "public"."feedback_comments" from "authenticated";

revoke update on table "public"."feedback_comments" from "authenticated";

revoke delete on table "public"."feedback_comments" from "service_role";

revoke insert on table "public"."feedback_comments" from "service_role";

revoke references on table "public"."feedback_comments" from "service_role";

revoke select on table "public"."feedback_comments" from "service_role";

revoke trigger on table "public"."feedback_comments" from "service_role";

revoke truncate on table "public"."feedback_comments" from "service_role";

revoke update on table "public"."feedback_comments" from "service_role";

revoke delete on table "public"."feedback_tags" from "anon";

revoke insert on table "public"."feedback_tags" from "anon";

revoke references on table "public"."feedback_tags" from "anon";

revoke select on table "public"."feedback_tags" from "anon";

revoke trigger on table "public"."feedback_tags" from "anon";

revoke truncate on table "public"."feedback_tags" from "anon";

revoke update on table "public"."feedback_tags" from "anon";

revoke delete on table "public"."feedback_tags" from "authenticated";

revoke insert on table "public"."feedback_tags" from "authenticated";

revoke references on table "public"."feedback_tags" from "authenticated";

revoke select on table "public"."feedback_tags" from "authenticated";

revoke trigger on table "public"."feedback_tags" from "authenticated";

revoke truncate on table "public"."feedback_tags" from "authenticated";

revoke update on table "public"."feedback_tags" from "authenticated";

revoke delete on table "public"."feedback_tags" from "service_role";

revoke insert on table "public"."feedback_tags" from "service_role";

revoke references on table "public"."feedback_tags" from "service_role";

revoke select on table "public"."feedback_tags" from "service_role";

revoke trigger on table "public"."feedback_tags" from "service_role";

revoke truncate on table "public"."feedback_tags" from "service_role";

revoke update on table "public"."feedback_tags" from "service_role";

revoke delete on table "public"."feedback_upvoters" from "anon";

revoke insert on table "public"."feedback_upvoters" from "anon";

revoke references on table "public"."feedback_upvoters" from "anon";

revoke select on table "public"."feedback_upvoters" from "anon";

revoke trigger on table "public"."feedback_upvoters" from "anon";

revoke truncate on table "public"."feedback_upvoters" from "anon";

revoke update on table "public"."feedback_upvoters" from "anon";

revoke delete on table "public"."feedback_upvoters" from "authenticated";

revoke insert on table "public"."feedback_upvoters" from "authenticated";

revoke references on table "public"."feedback_upvoters" from "authenticated";

revoke select on table "public"."feedback_upvoters" from "authenticated";

revoke trigger on table "public"."feedback_upvoters" from "authenticated";

revoke truncate on table "public"."feedback_upvoters" from "authenticated";

revoke update on table "public"."feedback_upvoters" from "authenticated";

revoke delete on table "public"."feedback_upvoters" from "service_role";

revoke insert on table "public"."feedback_upvoters" from "service_role";

revoke references on table "public"."feedback_upvoters" from "service_role";

revoke select on table "public"."feedback_upvoters" from "service_role";

revoke trigger on table "public"."feedback_upvoters" from "service_role";

revoke truncate on table "public"."feedback_upvoters" from "service_role";

revoke update on table "public"."feedback_upvoters" from "service_role";

revoke delete on table "public"."notifications" from "anon";

revoke insert on table "public"."notifications" from "anon";

revoke references on table "public"."notifications" from "anon";

revoke select on table "public"."notifications" from "anon";

revoke trigger on table "public"."notifications" from "anon";

revoke truncate on table "public"."notifications" from "anon";

revoke update on table "public"."notifications" from "anon";

revoke delete on table "public"."notifications" from "authenticated";

revoke insert on table "public"."notifications" from "authenticated";

revoke references on table "public"."notifications" from "authenticated";

revoke select on table "public"."notifications" from "authenticated";

revoke trigger on table "public"."notifications" from "authenticated";

revoke truncate on table "public"."notifications" from "authenticated";

revoke update on table "public"."notifications" from "authenticated";

revoke delete on table "public"."notifications" from "service_role";

revoke insert on table "public"."notifications" from "service_role";

revoke references on table "public"."notifications" from "service_role";

revoke select on table "public"."notifications" from "service_role";

revoke trigger on table "public"."notifications" from "service_role";

revoke truncate on table "public"."notifications" from "service_role";

revoke update on table "public"."notifications" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."project_api_keys" from "anon";

revoke insert on table "public"."project_api_keys" from "anon";

revoke references on table "public"."project_api_keys" from "anon";

revoke select on table "public"."project_api_keys" from "anon";

revoke trigger on table "public"."project_api_keys" from "anon";

revoke truncate on table "public"."project_api_keys" from "anon";

revoke update on table "public"."project_api_keys" from "anon";

revoke delete on table "public"."project_api_keys" from "authenticated";

revoke insert on table "public"."project_api_keys" from "authenticated";

revoke references on table "public"."project_api_keys" from "authenticated";

revoke select on table "public"."project_api_keys" from "authenticated";

revoke trigger on table "public"."project_api_keys" from "authenticated";

revoke truncate on table "public"."project_api_keys" from "authenticated";

revoke update on table "public"."project_api_keys" from "authenticated";

revoke delete on table "public"."project_api_keys" from "service_role";

revoke insert on table "public"."project_api_keys" from "service_role";

revoke references on table "public"."project_api_keys" from "service_role";

revoke select on table "public"."project_api_keys" from "service_role";

revoke trigger on table "public"."project_api_keys" from "service_role";

revoke truncate on table "public"."project_api_keys" from "service_role";

revoke update on table "public"."project_api_keys" from "service_role";

revoke delete on table "public"."project_configs" from "anon";

revoke insert on table "public"."project_configs" from "anon";

revoke references on table "public"."project_configs" from "anon";

revoke select on table "public"."project_configs" from "anon";

revoke trigger on table "public"."project_configs" from "anon";

revoke truncate on table "public"."project_configs" from "anon";

revoke update on table "public"."project_configs" from "anon";

revoke delete on table "public"."project_configs" from "authenticated";

revoke insert on table "public"."project_configs" from "authenticated";

revoke references on table "public"."project_configs" from "authenticated";

revoke select on table "public"."project_configs" from "authenticated";

revoke trigger on table "public"."project_configs" from "authenticated";

revoke truncate on table "public"."project_configs" from "authenticated";

revoke update on table "public"."project_configs" from "authenticated";

revoke delete on table "public"."project_configs" from "service_role";

revoke insert on table "public"."project_configs" from "service_role";

revoke references on table "public"."project_configs" from "service_role";

revoke select on table "public"."project_configs" from "service_role";

revoke trigger on table "public"."project_configs" from "service_role";

revoke truncate on table "public"."project_configs" from "service_role";

revoke update on table "public"."project_configs" from "service_role";

revoke delete on table "public"."project_invites" from "anon";

revoke insert on table "public"."project_invites" from "anon";

revoke references on table "public"."project_invites" from "anon";

revoke select on table "public"."project_invites" from "anon";

revoke trigger on table "public"."project_invites" from "anon";

revoke truncate on table "public"."project_invites" from "anon";

revoke update on table "public"."project_invites" from "anon";

revoke delete on table "public"."project_invites" from "authenticated";

revoke insert on table "public"."project_invites" from "authenticated";

revoke references on table "public"."project_invites" from "authenticated";

revoke select on table "public"."project_invites" from "authenticated";

revoke trigger on table "public"."project_invites" from "authenticated";

revoke truncate on table "public"."project_invites" from "authenticated";

revoke update on table "public"."project_invites" from "authenticated";

revoke delete on table "public"."project_invites" from "service_role";

revoke insert on table "public"."project_invites" from "service_role";

revoke references on table "public"."project_invites" from "service_role";

revoke select on table "public"."project_invites" from "service_role";

revoke trigger on table "public"."project_invites" from "service_role";

revoke truncate on table "public"."project_invites" from "service_role";

revoke update on table "public"."project_invites" from "service_role";

revoke delete on table "public"."project_members" from "anon";

revoke insert on table "public"."project_members" from "anon";

revoke references on table "public"."project_members" from "anon";

revoke select on table "public"."project_members" from "anon";

revoke trigger on table "public"."project_members" from "anon";

revoke truncate on table "public"."project_members" from "anon";

revoke update on table "public"."project_members" from "anon";

revoke delete on table "public"."project_members" from "authenticated";

revoke insert on table "public"."project_members" from "authenticated";

revoke references on table "public"."project_members" from "authenticated";

revoke select on table "public"."project_members" from "authenticated";

revoke trigger on table "public"."project_members" from "authenticated";

revoke truncate on table "public"."project_members" from "authenticated";

revoke update on table "public"."project_members" from "authenticated";

revoke delete on table "public"."project_members" from "service_role";

revoke insert on table "public"."project_members" from "service_role";

revoke references on table "public"."project_members" from "service_role";

revoke select on table "public"."project_members" from "service_role";

revoke trigger on table "public"."project_members" from "service_role";

revoke truncate on table "public"."project_members" from "service_role";

revoke update on table "public"."project_members" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke references on table "public"."projects" from "anon";

revoke select on table "public"."projects" from "anon";

revoke trigger on table "public"."projects" from "anon";

revoke truncate on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."projects" from "authenticated";

revoke insert on table "public"."projects" from "authenticated";

revoke references on table "public"."projects" from "authenticated";

revoke select on table "public"."projects" from "authenticated";

revoke trigger on table "public"."projects" from "authenticated";

revoke truncate on table "public"."projects" from "authenticated";

revoke update on table "public"."projects" from "authenticated";

revoke delete on table "public"."projects" from "service_role";

revoke insert on table "public"."projects" from "service_role";

revoke references on table "public"."projects" from "service_role";

revoke select on table "public"."projects" from "service_role";

revoke trigger on table "public"."projects" from "service_role";

revoke truncate on table "public"."projects" from "service_role";

revoke update on table "public"."projects" from "service_role";

alter table "public"."changelog_subscribers" drop constraint "changelog_subscribers_project_id_fkey";

alter table "public"."changelogs" drop constraint "changelogs_author_id_fkey";

alter table "public"."changelogs" drop constraint "changelogs_project_id_fkey";

alter table "public"."feedback_comments" drop constraint "feedback_comments_feedback_id_fkey";

alter table "public"."feedback_comments" drop constraint "feedback_comments_reply_to_id_fkey";

alter table "public"."feedback_comments" drop constraint "feedback_comments_user_id_fkey";

alter table "public"."feedback_tags" drop constraint "feedback_tags_project_id_fkey";

alter table "public"."feedback_upvoters" drop constraint "feedback_upvoters_feedback_id_fkey";

alter table "public"."feedback_upvoters" drop constraint "feedback_upvoters_profile_id_fkey";

alter table "public"."notifications" drop constraint "notifications_comment_id_fkey";

alter table "public"."notifications" drop constraint "notifications_feedback_id_fkey";

alter table "public"."notifications" drop constraint "notifications_initiator_id_fkey";

alter table "public"."notifications" drop constraint "notifications_project_id_fkey";

alter table "public"."project_api_keys" drop constraint "project_api_keys_creator_id_fkey";

alter table "public"."project_api_keys" drop constraint "project_api_keys_project_id_fkey";

alter table "public"."project_configs" drop constraint "project_configs_custom_domain_key";

alter table "public"."project_configs" drop constraint "project_configs_project_id_fkey";

alter table "public"."project_invites" drop constraint "project_invites_creator_id_fkey";

alter table "public"."project_invites" drop constraint "project_invites_project_id_fkey";

alter table "public"."project_members" drop constraint "project_members_member_id_fkey";

alter table "public"."project_members" drop constraint "project_members_project_id_fkey";

alter table "public"."projects" drop constraint "projects_slug_key";

alter table "public"."feedback" drop constraint "feedback_project_id_fkey";

alter table "public"."feedback" drop constraint "feedback_user_id_fkey";

drop function if exists "public"."is_allowed_api_token"(apitoken text, tokentype token_type[]);

alter table "public"."changelog_subscribers" drop constraint "changelog_subscribers_pkey";

alter table "public"."changelogs" drop constraint "changelogs_pkey";

alter table "public"."feedback_comments" drop constraint "feedback_comments_pkey";

alter table "public"."feedback_tags" drop constraint "feedback_tags_pkey";

alter table "public"."feedback_upvoters" drop constraint "feedback_upvoteres_pkey";

alter table "public"."notifications" drop constraint "notifications_pkey";

alter table "public"."profiles" drop constraint "profiles_pkey";

alter table "public"."project_api_keys" drop constraint "project_api_keys_pkey";

alter table "public"."project_configs" drop constraint "project_config_pkey";

alter table "public"."project_invites" drop constraint "project_invites_pkey";

alter table "public"."project_members" drop constraint "project_members_pkey";

alter table "public"."projects" drop constraint "projects_pkey";

drop index if exists "public"."changelog_subscribers_pkey";

drop index if exists "public"."changelogs_pkey";

drop index if exists "public"."feedback_comments_pkey";

drop index if exists "public"."feedback_tags_pkey";

drop index if exists "public"."feedback_upvoteres_pkey";

drop index if exists "public"."notifications_pkey";

drop index if exists "public"."profiles_pkey";

drop index if exists "public"."project_api_keys_pkey";

drop index if exists "public"."project_config_pkey";

drop index if exists "public"."project_configs_custom_domain_key";

drop index if exists "public"."project_invites_pkey";

drop index if exists "public"."project_members_pkey";

drop index if exists "public"."projects_pkey";

drop index if exists "public"."projects_slug_key";

drop table "public"."changelog_subscribers";

drop table "public"."changelogs";

drop table "public"."feedback_comments";

drop table "public"."feedback_tags";

drop table "public"."feedback_upvoters";

drop table "public"."notifications";

drop table "public"."profiles";

drop table "public"."project_api_keys";

drop table "public"."project_configs";

drop table "public"."project_invites";

drop table "public"."project_members";

drop table "public"."projects";

create table "public"."changelog" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null default ''::text,
    "content" text,
    "workspace_id" uuid not null,
    "published" boolean not null,
    "summary" text,
    "thumbnail" text,
    "author_id" uuid not null,
    "slug" text not null default ''::text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."changelog" enable row level security;

create table "public"."changelog_subscriber" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."changelog_subscriber" enable row level security;

create table "public"."feedback_comment" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "feedback_id" uuid not null,
    "content" text not null,
    "created_at" timestamp with time zone not null default now(),
    "upvotes" bigint not null default '0'::bigint,
    "reply_to_id" uuid
);


alter table "public"."feedback_comment" enable row level security;

create table "public"."feedback_tag" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "color" text not null,
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null
);


alter table "public"."feedback_tag" enable row level security;

create table "public"."feedback_upvoter" (
    "id" uuid not null default gen_random_uuid(),
    "feedback_id" uuid not null,
    "workspace_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."feedback_upvoter" enable row level security;

create table "public"."notification" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "has_archived" uuid[],
    "created_at" timestamp with time zone not null default now(),
    "initiator_id" uuid not null,
    "type" notification_type not null,
    "feedback_id" uuid not null,
    "comment_id" uuid
);


alter table "public"."notification" enable row level security;

create table "public"."profile" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "avatar_url" text,
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."profile" enable row level security;

create table "public"."workspace" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" character varying not null
);


alter table "public"."workspace" enable row level security;

create table "public"."workspace_api_key" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "permission" api_token_type not null,
    "token" text not null,
    "short_token" text not null,
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null,
    "creator_id" uuid not null
);


alter table "public"."workspace_api_key" enable row level security;

create table "public"."workspace_config" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "changelog_twitter_handle" text,
    "changelog_preview_style" text not null default 'summary'::text,
    "workspace_id" uuid not null,
    "integration_discord_status" boolean not null default false,
    "integration_discord_webhook" text,
    "integration_discord_role_id" text,
    "custom_domain" text,
    "custom_domain_verified" boolean,
    "integration_sso_secret" text,
    "integration_sso_status" boolean,
    "integration_sso_url" text,
    "custom_theme_accent" text,
    "custom_theme_background" text,
    "custom_theme_border" text,
    "custom_theme_primary_foreground" text,
    "custom_theme_root" text,
    "custom_theme_secondary_background" text,
    "feedback_allow_anon_upvoting" boolean,
    "logo_redirect_url" text,
    "integration_slack_status" boolean not null default false,
    "integration_slack_webhook" text,
    "changelog_enabled" boolean not null default true,
    "workspace_icon" text,
    "workspace_icon_radius" text not null default 'rounded-md'::text,
    "workspace_og_image" text,
    "workspace_theme" theme_type not null default 'light'::theme_type
);


alter table "public"."workspace_config" enable row level security;

create table "public"."workspace_invite" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "creator_id" uuid not null,
    "email" text not null,
    "accepted" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."workspace_invite" enable row level security;

create table "public"."workspace_member" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "member_id" uuid not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."workspace_member" enable row level security;

alter table "public"."feedback" drop column "project_id";

alter table "public"."feedback" add column "upvoters" uuid[];

alter table "public"."feedback" add column "workspace_id" uuid not null;

alter table "public"."feedback" alter column "status" set default 'in review'::status_type;

alter table "public"."feedback" alter column "status" set data type status_type using "status"::text::status_type;

drop type "public"."notification_types";

drop type "public"."status_options";

drop type "public"."token_type";

CREATE UNIQUE INDEX changelog_subscribers_pkey ON public.changelog_subscriber USING btree (id);

CREATE UNIQUE INDEX changelogs_pkey ON public.changelog USING btree (id);

CREATE UNIQUE INDEX feedback_comments_pkey ON public.feedback_comment USING btree (id);

CREATE UNIQUE INDEX feedback_tags_pkey ON public.feedback_tag USING btree (id);

CREATE UNIQUE INDEX feedback_upvoteres_pkey ON public.feedback_upvoter USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notification USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX project_api_keys_pkey ON public.workspace_api_key USING btree (id);

CREATE UNIQUE INDEX project_config_pkey ON public.workspace_config USING btree (id);

CREATE UNIQUE INDEX project_configs_custom_domain_key ON public.workspace_config USING btree (custom_domain);

CREATE UNIQUE INDEX project_invites_pkey ON public.workspace_invite USING btree (id);

CREATE UNIQUE INDEX project_members_pkey ON public.workspace_member USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.workspace USING btree (id);

CREATE UNIQUE INDEX projects_slug_key ON public.workspace USING btree (slug);

alter table "public"."changelog" add constraint "changelogs_pkey" PRIMARY KEY using index "changelogs_pkey";

alter table "public"."changelog_subscriber" add constraint "changelog_subscribers_pkey" PRIMARY KEY using index "changelog_subscribers_pkey";

alter table "public"."feedback_comment" add constraint "feedback_comments_pkey" PRIMARY KEY using index "feedback_comments_pkey";

alter table "public"."feedback_tag" add constraint "feedback_tags_pkey" PRIMARY KEY using index "feedback_tags_pkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoteres_pkey" PRIMARY KEY using index "feedback_upvoteres_pkey";

alter table "public"."notification" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."profile" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."workspace" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."workspace_api_key" add constraint "project_api_keys_pkey" PRIMARY KEY using index "project_api_keys_pkey";

alter table "public"."workspace_config" add constraint "project_config_pkey" PRIMARY KEY using index "project_config_pkey";

alter table "public"."workspace_invite" add constraint "project_invites_pkey" PRIMARY KEY using index "project_invites_pkey";

alter table "public"."workspace_member" add constraint "project_members_pkey" PRIMARY KEY using index "project_members_pkey";

alter table "public"."changelog" add constraint "changelogs_author_id_fkey" FOREIGN KEY (author_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."changelog" validate constraint "changelogs_author_id_fkey";

alter table "public"."changelog" add constraint "changelogs_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE not valid;

alter table "public"."changelog" validate constraint "changelogs_project_id_fkey";

alter table "public"."changelog_subscriber" add constraint "changelog_subscribers_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."changelog_subscriber" validate constraint "changelog_subscribers_project_id_fkey";

alter table "public"."feedback_comment" add constraint "feedback_comments_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_comment" validate constraint "feedback_comments_feedback_id_fkey";

alter table "public"."feedback_comment" add constraint "feedback_comments_reply_to_id_fkey" FOREIGN KEY (reply_to_id) REFERENCES feedback_comment(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_comment" validate constraint "feedback_comments_reply_to_id_fkey";

alter table "public"."feedback_comment" add constraint "feedback_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_comment" validate constraint "feedback_comments_user_id_fkey";

alter table "public"."feedback_tag" add constraint "feedback_tags_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_tag" validate constraint "feedback_tags_project_id_fkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoters_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_upvoter" validate constraint "feedback_upvoters_feedback_id_fkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoters_profile_id_fkey" FOREIGN KEY (workspace_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_upvoter" validate constraint "feedback_upvoters_profile_id_fkey";

alter table "public"."notification" add constraint "notifications_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES feedback_comment(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_comment_id_fkey";

alter table "public"."notification" add constraint "notifications_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_feedback_id_fkey";

alter table "public"."notification" add constraint "notifications_initiator_id_fkey" FOREIGN KEY (initiator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_initiator_id_fkey";

alter table "public"."notification" add constraint "notifications_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_project_id_fkey";

alter table "public"."workspace" add constraint "projects_slug_key" UNIQUE using index "projects_slug_key";

alter table "public"."workspace_api_key" add constraint "project_api_keys_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_api_key" validate constraint "project_api_keys_creator_id_fkey";

alter table "public"."workspace_api_key" add constraint "project_api_keys_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_api_key" validate constraint "project_api_keys_project_id_fkey";

alter table "public"."workspace_config" add constraint "project_configs_custom_domain_key" UNIQUE using index "project_configs_custom_domain_key";

alter table "public"."workspace_config" add constraint "project_configs_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) not valid;

alter table "public"."workspace_config" validate constraint "project_configs_project_id_fkey";

alter table "public"."workspace_invite" add constraint "project_invites_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_invite" validate constraint "project_invites_creator_id_fkey";

alter table "public"."workspace_invite" add constraint "project_invites_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_invite" validate constraint "project_invites_project_id_fkey";

alter table "public"."workspace_member" add constraint "project_members_member_id_fkey" FOREIGN KEY (member_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "project_members_member_id_fkey";

alter table "public"."workspace_member" add constraint "project_members_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "project_members_project_id_fkey";

alter table "public"."feedback" add constraint "feedback_project_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) not valid;

alter table "public"."feedback" validate constraint "feedback_project_id_fkey";

alter table "public"."feedback" add constraint "feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profile(id) not valid;

alter table "public"."feedback" validate constraint "feedback_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_allowed_api_token(apitoken text, tokentype api_token_type[])
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

grant delete on table "public"."changelog" to "anon";

grant insert on table "public"."changelog" to "anon";

grant references on table "public"."changelog" to "anon";

grant select on table "public"."changelog" to "anon";

grant trigger on table "public"."changelog" to "anon";

grant truncate on table "public"."changelog" to "anon";

grant update on table "public"."changelog" to "anon";

grant delete on table "public"."changelog" to "authenticated";

grant insert on table "public"."changelog" to "authenticated";

grant references on table "public"."changelog" to "authenticated";

grant select on table "public"."changelog" to "authenticated";

grant trigger on table "public"."changelog" to "authenticated";

grant truncate on table "public"."changelog" to "authenticated";

grant update on table "public"."changelog" to "authenticated";

grant delete on table "public"."changelog" to "service_role";

grant insert on table "public"."changelog" to "service_role";

grant references on table "public"."changelog" to "service_role";

grant select on table "public"."changelog" to "service_role";

grant trigger on table "public"."changelog" to "service_role";

grant truncate on table "public"."changelog" to "service_role";

grant update on table "public"."changelog" to "service_role";

grant delete on table "public"."changelog_subscriber" to "anon";

grant insert on table "public"."changelog_subscriber" to "anon";

grant references on table "public"."changelog_subscriber" to "anon";

grant select on table "public"."changelog_subscriber" to "anon";

grant trigger on table "public"."changelog_subscriber" to "anon";

grant truncate on table "public"."changelog_subscriber" to "anon";

grant update on table "public"."changelog_subscriber" to "anon";

grant delete on table "public"."changelog_subscriber" to "authenticated";

grant insert on table "public"."changelog_subscriber" to "authenticated";

grant references on table "public"."changelog_subscriber" to "authenticated";

grant select on table "public"."changelog_subscriber" to "authenticated";

grant trigger on table "public"."changelog_subscriber" to "authenticated";

grant truncate on table "public"."changelog_subscriber" to "authenticated";

grant update on table "public"."changelog_subscriber" to "authenticated";

grant delete on table "public"."changelog_subscriber" to "service_role";

grant insert on table "public"."changelog_subscriber" to "service_role";

grant references on table "public"."changelog_subscriber" to "service_role";

grant select on table "public"."changelog_subscriber" to "service_role";

grant trigger on table "public"."changelog_subscriber" to "service_role";

grant truncate on table "public"."changelog_subscriber" to "service_role";

grant update on table "public"."changelog_subscriber" to "service_role";

grant delete on table "public"."feedback_comment" to "anon";

grant insert on table "public"."feedback_comment" to "anon";

grant references on table "public"."feedback_comment" to "anon";

grant select on table "public"."feedback_comment" to "anon";

grant trigger on table "public"."feedback_comment" to "anon";

grant truncate on table "public"."feedback_comment" to "anon";

grant update on table "public"."feedback_comment" to "anon";

grant delete on table "public"."feedback_comment" to "authenticated";

grant insert on table "public"."feedback_comment" to "authenticated";

grant references on table "public"."feedback_comment" to "authenticated";

grant select on table "public"."feedback_comment" to "authenticated";

grant trigger on table "public"."feedback_comment" to "authenticated";

grant truncate on table "public"."feedback_comment" to "authenticated";

grant update on table "public"."feedback_comment" to "authenticated";

grant delete on table "public"."feedback_comment" to "service_role";

grant insert on table "public"."feedback_comment" to "service_role";

grant references on table "public"."feedback_comment" to "service_role";

grant select on table "public"."feedback_comment" to "service_role";

grant trigger on table "public"."feedback_comment" to "service_role";

grant truncate on table "public"."feedback_comment" to "service_role";

grant update on table "public"."feedback_comment" to "service_role";

grant delete on table "public"."feedback_tag" to "anon";

grant insert on table "public"."feedback_tag" to "anon";

grant references on table "public"."feedback_tag" to "anon";

grant select on table "public"."feedback_tag" to "anon";

grant trigger on table "public"."feedback_tag" to "anon";

grant truncate on table "public"."feedback_tag" to "anon";

grant update on table "public"."feedback_tag" to "anon";

grant delete on table "public"."feedback_tag" to "authenticated";

grant insert on table "public"."feedback_tag" to "authenticated";

grant references on table "public"."feedback_tag" to "authenticated";

grant select on table "public"."feedback_tag" to "authenticated";

grant trigger on table "public"."feedback_tag" to "authenticated";

grant truncate on table "public"."feedback_tag" to "authenticated";

grant update on table "public"."feedback_tag" to "authenticated";

grant delete on table "public"."feedback_tag" to "service_role";

grant insert on table "public"."feedback_tag" to "service_role";

grant references on table "public"."feedback_tag" to "service_role";

grant select on table "public"."feedback_tag" to "service_role";

grant trigger on table "public"."feedback_tag" to "service_role";

grant truncate on table "public"."feedback_tag" to "service_role";

grant update on table "public"."feedback_tag" to "service_role";

grant delete on table "public"."feedback_upvoter" to "anon";

grant insert on table "public"."feedback_upvoter" to "anon";

grant references on table "public"."feedback_upvoter" to "anon";

grant select on table "public"."feedback_upvoter" to "anon";

grant trigger on table "public"."feedback_upvoter" to "anon";

grant truncate on table "public"."feedback_upvoter" to "anon";

grant update on table "public"."feedback_upvoter" to "anon";

grant delete on table "public"."feedback_upvoter" to "authenticated";

grant insert on table "public"."feedback_upvoter" to "authenticated";

grant references on table "public"."feedback_upvoter" to "authenticated";

grant select on table "public"."feedback_upvoter" to "authenticated";

grant trigger on table "public"."feedback_upvoter" to "authenticated";

grant truncate on table "public"."feedback_upvoter" to "authenticated";

grant update on table "public"."feedback_upvoter" to "authenticated";

grant delete on table "public"."feedback_upvoter" to "service_role";

grant insert on table "public"."feedback_upvoter" to "service_role";

grant references on table "public"."feedback_upvoter" to "service_role";

grant select on table "public"."feedback_upvoter" to "service_role";

grant trigger on table "public"."feedback_upvoter" to "service_role";

grant truncate on table "public"."feedback_upvoter" to "service_role";

grant update on table "public"."feedback_upvoter" to "service_role";

grant delete on table "public"."notification" to "anon";

grant insert on table "public"."notification" to "anon";

grant references on table "public"."notification" to "anon";

grant select on table "public"."notification" to "anon";

grant trigger on table "public"."notification" to "anon";

grant truncate on table "public"."notification" to "anon";

grant update on table "public"."notification" to "anon";

grant delete on table "public"."notification" to "authenticated";

grant insert on table "public"."notification" to "authenticated";

grant references on table "public"."notification" to "authenticated";

grant select on table "public"."notification" to "authenticated";

grant trigger on table "public"."notification" to "authenticated";

grant truncate on table "public"."notification" to "authenticated";

grant update on table "public"."notification" to "authenticated";

grant delete on table "public"."notification" to "service_role";

grant insert on table "public"."notification" to "service_role";

grant references on table "public"."notification" to "service_role";

grant select on table "public"."notification" to "service_role";

grant trigger on table "public"."notification" to "service_role";

grant truncate on table "public"."notification" to "service_role";

grant update on table "public"."notification" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."workspace" to "anon";

grant insert on table "public"."workspace" to "anon";

grant references on table "public"."workspace" to "anon";

grant select on table "public"."workspace" to "anon";

grant trigger on table "public"."workspace" to "anon";

grant truncate on table "public"."workspace" to "anon";

grant update on table "public"."workspace" to "anon";

grant delete on table "public"."workspace" to "authenticated";

grant insert on table "public"."workspace" to "authenticated";

grant references on table "public"."workspace" to "authenticated";

grant select on table "public"."workspace" to "authenticated";

grant trigger on table "public"."workspace" to "authenticated";

grant truncate on table "public"."workspace" to "authenticated";

grant update on table "public"."workspace" to "authenticated";

grant delete on table "public"."workspace" to "service_role";

grant insert on table "public"."workspace" to "service_role";

grant references on table "public"."workspace" to "service_role";

grant select on table "public"."workspace" to "service_role";

grant trigger on table "public"."workspace" to "service_role";

grant truncate on table "public"."workspace" to "service_role";

grant update on table "public"."workspace" to "service_role";

grant delete on table "public"."workspace_api_key" to "anon";

grant insert on table "public"."workspace_api_key" to "anon";

grant references on table "public"."workspace_api_key" to "anon";

grant select on table "public"."workspace_api_key" to "anon";

grant trigger on table "public"."workspace_api_key" to "anon";

grant truncate on table "public"."workspace_api_key" to "anon";

grant update on table "public"."workspace_api_key" to "anon";

grant delete on table "public"."workspace_api_key" to "authenticated";

grant insert on table "public"."workspace_api_key" to "authenticated";

grant references on table "public"."workspace_api_key" to "authenticated";

grant select on table "public"."workspace_api_key" to "authenticated";

grant trigger on table "public"."workspace_api_key" to "authenticated";

grant truncate on table "public"."workspace_api_key" to "authenticated";

grant update on table "public"."workspace_api_key" to "authenticated";

grant delete on table "public"."workspace_api_key" to "service_role";

grant insert on table "public"."workspace_api_key" to "service_role";

grant references on table "public"."workspace_api_key" to "service_role";

grant select on table "public"."workspace_api_key" to "service_role";

grant trigger on table "public"."workspace_api_key" to "service_role";

grant truncate on table "public"."workspace_api_key" to "service_role";

grant update on table "public"."workspace_api_key" to "service_role";

grant delete on table "public"."workspace_config" to "anon";

grant insert on table "public"."workspace_config" to "anon";

grant references on table "public"."workspace_config" to "anon";

grant select on table "public"."workspace_config" to "anon";

grant trigger on table "public"."workspace_config" to "anon";

grant truncate on table "public"."workspace_config" to "anon";

grant update on table "public"."workspace_config" to "anon";

grant delete on table "public"."workspace_config" to "authenticated";

grant insert on table "public"."workspace_config" to "authenticated";

grant references on table "public"."workspace_config" to "authenticated";

grant select on table "public"."workspace_config" to "authenticated";

grant trigger on table "public"."workspace_config" to "authenticated";

grant truncate on table "public"."workspace_config" to "authenticated";

grant update on table "public"."workspace_config" to "authenticated";

grant delete on table "public"."workspace_config" to "service_role";

grant insert on table "public"."workspace_config" to "service_role";

grant references on table "public"."workspace_config" to "service_role";

grant select on table "public"."workspace_config" to "service_role";

grant trigger on table "public"."workspace_config" to "service_role";

grant truncate on table "public"."workspace_config" to "service_role";

grant update on table "public"."workspace_config" to "service_role";

grant delete on table "public"."workspace_invite" to "anon";

grant insert on table "public"."workspace_invite" to "anon";

grant references on table "public"."workspace_invite" to "anon";

grant select on table "public"."workspace_invite" to "anon";

grant trigger on table "public"."workspace_invite" to "anon";

grant truncate on table "public"."workspace_invite" to "anon";

grant update on table "public"."workspace_invite" to "anon";

grant delete on table "public"."workspace_invite" to "authenticated";

grant insert on table "public"."workspace_invite" to "authenticated";

grant references on table "public"."workspace_invite" to "authenticated";

grant select on table "public"."workspace_invite" to "authenticated";

grant trigger on table "public"."workspace_invite" to "authenticated";

grant truncate on table "public"."workspace_invite" to "authenticated";

grant update on table "public"."workspace_invite" to "authenticated";

grant delete on table "public"."workspace_invite" to "service_role";

grant insert on table "public"."workspace_invite" to "service_role";

grant references on table "public"."workspace_invite" to "service_role";

grant select on table "public"."workspace_invite" to "service_role";

grant trigger on table "public"."workspace_invite" to "service_role";

grant truncate on table "public"."workspace_invite" to "service_role";

grant update on table "public"."workspace_invite" to "service_role";

grant delete on table "public"."workspace_member" to "anon";

grant insert on table "public"."workspace_member" to "anon";

grant references on table "public"."workspace_member" to "anon";

grant select on table "public"."workspace_member" to "anon";

grant trigger on table "public"."workspace_member" to "anon";

grant truncate on table "public"."workspace_member" to "anon";

grant update on table "public"."workspace_member" to "anon";

grant delete on table "public"."workspace_member" to "authenticated";

grant insert on table "public"."workspace_member" to "authenticated";

grant references on table "public"."workspace_member" to "authenticated";

grant select on table "public"."workspace_member" to "authenticated";

grant trigger on table "public"."workspace_member" to "authenticated";

grant truncate on table "public"."workspace_member" to "authenticated";

grant update on table "public"."workspace_member" to "authenticated";

grant delete on table "public"."workspace_member" to "service_role";

grant insert on table "public"."workspace_member" to "service_role";

grant references on table "public"."workspace_member" to "service_role";

grant select on table "public"."workspace_member" to "service_role";

grant trigger on table "public"."workspace_member" to "service_role";

grant truncate on table "public"."workspace_member" to "service_role";

grant update on table "public"."workspace_member" to "service_role";

create policy "Allow API Access"
on "public"."changelog"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable delete for authenticated users only"
on "public"."changelog"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."changelog"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."changelog"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."changelog"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable delete access for all users"
on "public"."changelog_subscriber"
as permissive
for delete
to public
using (true);


create policy "Enable insert for everyone"
on "public"."changelog_subscriber"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."changelog_subscriber"
as permissive
for select
to public
using (true);


create policy "Enable delete for authenticated users only"
on "public"."feedback_comment"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback_comment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedback_comment"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."feedback_comment"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback_tag"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedback_tag"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."feedback_tag"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable delete for authenticated users only"
on "public"."feedback_upvoter"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback_upvoter"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedback_upvoter"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."notification"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."notification"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."notification"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "API Access for Insert"
on "public"."profile"
as permissive
for insert
to public
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::api_token_type[]));


create policy "API Access for Update"
on "public"."profile"
as permissive
for update
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access}'::api_token_type[]));


create policy "Public profiles are viewable by everyone."
on "public"."profile"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Allow API Access"
on "public"."workspace"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable delete for authenticated users only"
on "public"."workspace"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."workspace"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."workspace"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Allow API Access"
on "public"."workspace_api_key"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable delete for authenticated users only"
on "public"."workspace_api_key"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."workspace_api_key"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace_api_key"
as permissive
for select
to public
using (true);


create policy "Enable select for authenticated users only"
on "public"."workspace_api_key"
as permissive
for select
to authenticated
using (true);


create policy "Allow API Access"
on "public"."workspace_config"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable insert for authenticated users only"
on "public"."workspace_config"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace_config"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."workspace_config"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Allow API Access"
on "public"."workspace_invite"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable delete for authenticated users only"
on "public"."workspace_invite"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."workspace_invite"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace_invite"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."workspace_invite"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Allow API Access"
on "public"."workspace_member"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{full_access}'::api_token_type[]));


create policy "Enable insert for authenticated users only"
on "public"."workspace_member"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace_member"
as permissive
for select
to public
using (true);


create policy "API Access for Insert"
on "public"."feedback"
as permissive
for insert
to public
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'lumkey'::text), '{public_access,full_access}'::api_token_type[]));



