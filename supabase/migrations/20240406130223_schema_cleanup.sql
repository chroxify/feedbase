create type "public"."status_options" as enum ('in review', 'planned', 'in progress', 'completed', 'rejected');

drop policy "Enable insert access for all users" on "public"."waitlist";

alter table "public"."waitlist" drop constraint "waitlist_email_key";

alter table "public"."waitlist" drop constraint "waitlist_pkey";

drop index if exists "public"."waitlist_email_key";

drop index if exists "public"."waitlist_pkey";

drop table "public"."waitlist";

alter table "public"."feedback" drop column "description";

alter table "public"."feedback" add column "content" text not null;

alter table "public"."feedback" alter column "status" set default 'in review'::status_options;

alter table "public"."feedback" alter column "status" set not null;

alter table "public"."feedback" alter column "status" set data type status_options using "status"::status_options;

drop policy "Only authenticated users can insert 1lcb7wx_0" on "storage"."objects";